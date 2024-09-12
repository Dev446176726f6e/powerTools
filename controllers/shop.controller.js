const { errorHandler } = require("../helpers/error_handler");
const Shop = require("../models/shop");
const Owner = require("../models/owner");
const District = require("../models/district");

const addShop = async (req, res) => {
  try {
    const { name, owner_id, phone_number, district_id, address, location } =
      req.body;

    const newShop = await Shop.create({
      name,
      owner_id,
      phone_number,
      district_id,
      address,
      location,
    });

    res.status(201).send({ message: "New shop created", id: newShop.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getShopById = async (req, res) => {
  try {
    const shopId = req.params.id;
    const foundShop = await Shop.findByPk(shopId, {
      include: [Owner, District],
    });

    if (!foundShop) {
      return res.status(404).send({ message: "Shop not found" });
    }

    res.status(200).send(foundShop);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getShops = async (req, res) => {
  try {
    const shops = await Shop.findAll({
      include: [Owner, District], 
    });

    if (shops.length === 0) {
      return res.status(404).send({ message: "No shops found" });
    }

    res.status(200).send(shops);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateShop = async (req, res) => {
  try {
    const { name, owner_id, phone_number, district_id, address, location } =
      req.body;
    const shopId = req.params.id;

    const foundShop = await Shop.findByPk(shopId);

    if (!foundShop) {
      return res.status(404).send({ message: "Shop not found" });
    }

    const updatedShop = await Shop.update(
      { name, owner_id, phone_number, district_id, address, location },
      { where: { id: shopId } }
    );

    if (updatedShop[0] === 0) {
      return res.status(404).send({ message: "No shop was updated" });
    }

    res.status(200).send({ message: "Shop updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteShop = async (req, res) => {
  try {
    const shopId = req.params.id;

    const foundShop = await Shop.findByPk(shopId);

    if (!foundShop) {
      return res.status(404).send({ message: "Shop not found" });
    }

    await Shop.destroy({
      where: { id: shopId },
    });

    res.status(200).send({ message: "Shop deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addShop,
  getShopById,
  getShops,
  updateShop,
  deleteShop,
};
