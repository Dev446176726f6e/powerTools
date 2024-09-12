const { Router } = require("express");
const {
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  addDistrict,
} = require("../controllers/district.controller");

const router = Router();

router.get("/all", getDistricts);
router.get("/:id", getDistrictById);
router.put("/update", updateDistrict);
router.delete("/delete", deleteDistrict);
router.post("/add", addDistrict);

module.exports = router;
