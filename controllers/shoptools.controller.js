const { errorHandler } = require("../helpers/error_handler");
const ShopTool = require("../models/shop_tool");
const Shop = require("../models/shop");
const Tool = require("../models/tool");

const addShopTool = async (req, res) => {
  try {
    const { shop_id, tool_id, rent_price, total_price } = req.body;

    const newShopTool = await ShopTool.create({
      shop_id,
      tool_id,
      rent_price,
      total_price,
    });

    res
      .status(201)
      .send({ message: "New shop tool created", id: newShopTool.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getShopToolById = async (req, res) => {
  try {
    const shopToolId = req.params.id;
    const foundShopTool = await ShopTool.findByPk(shopToolId, {
      include: [Shop, Tool], 
    });

    if (!foundShopTool) {
      return res.status(404).send({ message: "ShopTool not found" });
    }

    res.status(200).send(foundShopTool);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getShopTools = async (req, res) => {
  try {
    const shopTools = await ShopTool.findAll({
      include: [Shop, Tool], 
    });

    if (shopTools.length === 0) {
      return res.status(404).send({ message: "No shop tools found" });
    }

    res.status(200).send(shopTools);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateShopTool = async (req, res) => {
  try {
    const { shop_id, tool_id, rent_price, total_price } = req.body;
    const shopToolId = req.params.id;

    const foundShopTool = await ShopTool.findByPk(shopToolId);

    if (!foundShopTool) {
      return res.status(404).send({ message: "ShopTool not found" });
    }

    const updatedShopTool = await ShopTool.update(
      { shop_id, tool_id, rent_price, total_price },
      { where: { id: shopToolId } }
    );

    if (updatedShopTool[0] === 0) {
      return res.status(404).send({ message: "No shop tool was updated" });
    }

    res.status(200).send({ message: "Shop tool updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteShopTool = async (req, res) => {
  try {
    const shopToolId = req.params.id;

    const foundShopTool = await ShopTool.findByPk(shopToolId);

    if (!foundShopTool) {
      return res.status(404).send({ message: "ShopTool not found" });
    }

    await ShopTool.destroy({
      where: { id: shopToolId },
    });

    res.status(200).send({ message: "Shop tool deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addShopTool,
  getShopToolById,
  getShopTools,
  updateShopTool,
  deleteShopTool,
};
