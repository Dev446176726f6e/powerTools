const { Router } = require("express");
const {
  getClients,
  getClientByID,
  updateClient,
  deleteClient,
  addClient,
  signUp,
  signOut,
  refreshToken,
} = require("../controllers/client.controller");

const router = Router();

router.get("/all", getClients);
router.get("/:id", getClientByID);
router.put("/update", updateClient);
router.delete("/delete", deleteClient);
router.post("/add", addClient);
router.post("/signup", signUp);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);

module.exports = router;
