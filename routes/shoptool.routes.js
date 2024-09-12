const { Router } = require("express");
const {
  getShopTools,
  getShopToolById,
  updateShopTool,
  deleteShopTool,
  addShopTool,
} = require("../controllers/shoptools.controller");

const router = Router();

router.get("/all", getShopTools);
router.get("/:id", getShopToolById);
router.put("/update", updateShopTool);
router.delete("/delete", deleteShopTool);
router.post("/add", addShopTool);

module.exports = router;
