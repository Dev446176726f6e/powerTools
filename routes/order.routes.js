const { Router } = require("express");
const {
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  addOrder,
} = require("../controllers/order.controller");

const router = Router();

router.get("/all", getOrders);
router.get("/:id", getOrderById);
router.put("/update", updateOrder);
router.delete("/delete", deleteOrder);
router.post("/add", addOrder);

module.exports = router;
