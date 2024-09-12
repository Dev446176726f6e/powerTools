const { Router } = require("express");
const {
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  addShop,
} = require("../controllers/shop.controller");

const router = Router();

router.get("/all", getShops);
router.get("/:id", getShopById);
router.put("/update", updateShop);
router.delete("/delete", deleteShop);
router.post("/add", addShop);

module.exports = router;
