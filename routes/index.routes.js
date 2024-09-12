const { Router } = require("express");
const clientRouter = require("./client.routes");
const districtRouter = require("./district.routes");
const orderRouter = require("./order.routes");
const ownerRouter = require("./owner.routes");
const shopRouter = require("./shop.routes");
const shoptoolRouter = require("./shoptool.routes");
const toolRouter = require("./tool.routes");

const router = Router();

router.use("/client", clientRouter);
router.use("/district", districtRouter);
router.use("/order", orderRouter);
router.use("/owner", ownerRouter);
router.use("/shop", shopRouter);
router.use("/shoptool", shoptoolRouter);
router.use("/tool", toolRouter);

module.exports = router;
