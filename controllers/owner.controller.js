const { errorHandler } = require("../helpers/error_handler");
const Owner = require("../models/owner");
const config = require("config");
const bcrypt = require("bcrypt");
const myJwt = require("../services/jwt_service");
const to = require("../utils/to");

const signUp = async (req, res) => {
  try {
    const { phone_number, password } = req.body;
    const owner = await Owner.findOne({ where: { phone_number } });
    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      return res
        .status(400)
        .send({ message: "Invalid phone number or password" });
    }

    const payload = {
      id: owner.id,
      phone_number: owner.phone_number,
    };

    const tokens = myJwt.generateTokens(payload);
    owner.token = tokens.refreshToken;
    await owner.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: parseInt(config.get("jwt.refresh_time")) * 24 * 60 * 60 * 1000,
    });

    res.status(201).send({
      message: "Owner signed up",
      id: owner.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const signOut = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh token not found" });
    }
    const owner = await Owner.findOne({
      where: { token: refreshToken },
    });
    if (!owner) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    owner.token = "";
    await owner.save();

    res.clearCookie("refreshToken");

    res.status(200).send({
      message: "Owner logged out successfully",
      refreshToken: owner.token,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).send({ message: "Refresh token not found" });
    }
    const [error, decodedRefreshToken] = await to(
      myJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }

    const ownerFromDB = await Owner.findOne({
      where: { token: refreshToken },
    });
    if (!ownerFromDB) {
      return res.status(403).send({
        message: "Forbidden owner (refresh token does not match)",
      });
    }

    const payload = {
      id: ownerFromDB.id,
      phone_number: ownerFromDB.phone_number,
    };

    const tokens = myJwt.generateTokens(payload);

    ownerFromDB.token = tokens.refreshToken;
    await ownerFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_as"),
    });

    res.status(201).send({
      message: "Token refreshed successfully",
      id: ownerFromDB.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const addOwner = async (req, res) => {
  try {
    const { name, phone_number, password, otp_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = await Owner.create({
      name,
      phone_number,
      password: hashedPassword,
      otp_id,
    });

    res.status(201).send({ message: "New owner created", id: newOwner.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwnerByID = async (req, res) => {
  try {
    const ownerID = req.params.id;
    const foundOwner = await Owner.findByPk(ownerID);
    if (!foundOwner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    res.status(200).send({
      name: foundOwner.name,
      phone_number: foundOwner.phone_number,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    if (owners.length === 0) {
      return res.status(404).send({ message: "No owner found" });
    }
    res.status(200).send(owners);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwner = async (req, res) => {
  try {
    const { name, phone_number } = req.body;

    const ownerID = req.params.id;
    const foundOwner = await Owner.findByPk(ownerID);
    if (!foundOwner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    const [updatedOwner] = await Owner.update(
      {
        name,
        phone_number,
      },
      { where: { id: ownerID } }
    );
    if (updatedOwner === 0) {
      return res.status(404).send({ message: "No owner was updated" });
    }
    res.status(200).send({
      message: "Owner updated successfully",
      affectedRows: updatedOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwner = async (req, res) => {
  try {
    const ownerID = req.params.id;
    const foundOwner = await Owner.findByPk(ownerID);
    if (!foundOwner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    const deletedOwner = await Owner.destroy({
      where: { id: ownerID },
    });
    if (deletedOwner === 0) {
      return res.status(404).send({ message: "No owner was deleted" });
    }
    res.status(200).send({
      message: "Owner deleted successfully",
      affectedRows: deletedOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addOwner,
  getOwnerByID,
  getOwners,
  updateOwner,
  deleteOwner,
  signOut,
  signUp,
  refreshToken,
};
