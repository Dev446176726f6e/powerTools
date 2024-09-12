const { errorHandler } = require("../helpers/error_handler");
const Client = require("../models/client");
const config = require("config");
const bcrypt = require("bcrypt");
const myJwt = require("../helpers/jwt");

const signUp = async (req, res) => {
  try {
    const { phone_number, otp_id } = req.body;
    const client = await Client.findOne({ where: { phone_number } });
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    if (client.otp_id !== otp_id) {
      return res.status(400).send({ message: "Invalid phone number or OTP" });
    }

    const payload = {
      id: client.id,
      phone_number: client.phone_number,
    };

    const tokens = myJwt.generateTokens(payload);
    client.token = tokens.refreshToken;
    await client.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: parseInt(config.get("jwt.refresh_time")) * 24 * 60 * 60 * 1000,
    });

    res.status(201).send({
      message: "Client signed up",
      id: client.id,
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
    const client = await Client.findOne({ where: { token: refreshToken } });
    if (!client) {
      return res.status(400).send({ message: "Invalid refresh token" });
    }

    client.token = "";
    await client.save();

    res.clearCookie("refreshToken");

    res.status(200).send({
      message: "Client logged out successfully",
      refreshToken: client.token,
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
    const [error, decodedRefreshToken] = await myJwt.verifyRefreshToken(
      refreshToken
    );
    if (error) {
      return res.status(403).send({ error: error.message });
    }

    const clientFromDB = await Client.findOne({
      where: { token: refreshToken },
    });
    if (!clientFromDB) {
      return res.status(403).send({
        message: "Forbidden client (refresh token does not match)",
      });
    }

    const payload = {
      id: clientFromDB.id,
      phone_number: clientFromDB.phone_number,
    };

    const tokens = myJwt.generateTokens(payload);

    clientFromDB.token = tokens.refreshToken;
    await clientFromDB.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_time_as"),
    });

    res.status(201).send({
      message: "Token refreshed successfully",
      id: clientFromDB.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addClient = async (req, res) => {
  try {
    const { name, phone_number, address, otp_id } = req.body;

    const newClient = await Client.create({
      name,
      phone_number,
      address,
      otp_id,
    });

    res.status(201).send({ message: "New client created", id: newClient.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientByID = async (req, res) => {
  try {
    const clientID = req.params.id;
    const foundClient = await Client.findByPk(clientID);
    if (!foundClient) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send({
      name: foundClient.name,
      phone_number: foundClient.phone_number,
      address: foundClient.address,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    if (clients.length === 0) {
      return res.status(404).send({ message: "No client found" });
    }
    res.status(200).send(clients);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClient = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;

    const clientID = req.params.id;
    const foundClient = await Client.findByPk(clientID);
    if (!foundClient) {
      return res.status(404).send({ message: "Client not found" });
    }
    const [updatedClient] = await Client.update(
      {
        name,
        address,
        phone_number,
      },
      { where: { id: clientID } }
    );
    if (updatedClient === 0) {
      return res.status(404).send({ message: "No client was updated" });
    }
    res.status(200).send({
      message: "Client updated successfully",
      affectedRows: updatedClient,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClient = async (req, res) => {
  try {
    const clientID = req.params.id;
    const foundClient = await Client.findByPk(clientID);
    if (!foundClient) {
      return res.status(404).send({ message: "Client not found" });
    }
    const deletedClient = await Client.destroy({
      where: { id: clientID },
    });
    if (deletedClient === 0) {
      return res.status(404).send({ message: "No client was deleted" });
    }
    res.status(200).send({
      message: "Client deleted successfully",
      affectedRows: deletedClient,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addClient,
  getClientByID,
  getClients,
  updateClient,
  deleteClient,
  signOut,
  signUp,
  refreshToken,
};
