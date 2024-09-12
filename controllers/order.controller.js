const { errorHandler } = require("../helpers/error_handler");
const Order = require("../models/order");
const Client = require("../models/client");
const ShopTool = require("../models/shop_tool");

const addOrder = async (req, res) => {
  try {
    const { client_Id, shop_tool_Id, order_date, period, total_price } =
      req.body;

    const client = await Client.findByPk(client_Id);
    const shopTool = await ShopTool.findByPk(shop_tool_Id);

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    if (!shopTool) {
      return res.status(404).send({ message: "Shop tool not found" });
    }

    const newOrder = await Order.create({
      client_Id,
      shop_tool_Id,
      order_date,
      period,
      total_price,
    });

    res.status(201).send({ message: "New order created", id: newOrder.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const foundOrder = await Order.findByPk(orderId, {
      include: [Client, ShopTool],
    });

    if (!foundOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).send(foundOrder);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [Client, ShopTool],
    });

    if (orders.length === 0) {
      return res.status(404).send({ message: "No orders found" });
    }

    res.status(200).send(orders);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOrder = async (req, res) => {
  try {
    const { client_Id, shop_tool_Id, order_date, period, total_price } =
      req.body;
    const orderId = req.params.id;

    const foundOrder = await Order.findByPk(orderId);

    if (!foundOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    const updatedOrder = await Order.update(
      {
        client_Id,
        shop_tool_Id,
        order_date,
        period,
        total_price,
      },
      { where: { id: orderId } }
    );

    if (updatedOrder[0] === 0) {
      return res.status(404).send({ message: "Order not updated" });
    }

    res.status(200).send({ message: "Order updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const foundOrder = await Order.findByPk(orderId);

    if (!foundOrder) {
      return res.status(404).send({ message: "Order not found" });
    }

    await Order.destroy({
      where: { id: orderId },
    });

    res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addOrder,
  getOrderById,
  getOrders,
  updateOrder,
  deleteOrder,
};
