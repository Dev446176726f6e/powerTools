const { Router } = require("express");
const {
  getTools,
  getToolById,
  updateTool,
  deleteTool,
  addTool,
} = require("../controllers/tool.controller");

const router = Router();

router.get("/all", getTools);
router.get("/:id", getToolById);
router.put("/update", updateTool);
router.delete("/delete", deleteTool);
router.post("/add", addTool);

module.exports = router;
