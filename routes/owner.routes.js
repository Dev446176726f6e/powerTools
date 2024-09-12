const { Router } = require("express");
const {
  getOwners,
  getOwnerByID,
  updateOwner,
  deleteOwner,
  addOwner,
  signUp,
  signOut,
  refreshToken,
} = require("../controllers/owner.controller");

const router = Router();

router.get("/all", getOwners);
router.get("/:id", getOwnerByID);
router.put("/update", updateOwner);
router.delete("/delete", deleteOwner);
router.post("/add", addOwner);
router.post("/signup", signUp);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);

module.exports = router;
