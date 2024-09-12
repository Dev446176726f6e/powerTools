const { errorHandler } = require("../helpers/error_handler");
const Tool = require("../models/tool");

const addTool = async (req, res) => {
  try {
    const { name, brand, description } = req.body;

    const newTool = await Tool.create({
      name,
      brand,
      description,
    });

    res.status(201).send({ message: "New tool created", id: newTool.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getToolById = async (req, res) => {
  try {
    const toolId = req.params.id;
    const foundTool = await Tool.findByPk(toolId);

    if (!foundTool) {
      return res.status(404).send({ message: "Tool not found" });
    }

    res.status(200).send(foundTool);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTools = async (req, res) => {
  try {
    const tools = await Tool.findAll();

    if (tools.length === 0) {
      return res.status(404).send({ message: "No tools found" });
    }

    res.status(200).send(tools);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTool = async (req, res) => {
  try {
    const { name, brand, description } = req.body;
    const toolId = req.params.id;

    const foundTool = await Tool.findByPk(toolId);

    if (!foundTool) {
      return res.status(404).send({ message: "Tool not found" });
    }

    const updatedTool = await Tool.update(
      { name, brand, description },
      { where: { id: toolId } }
    );

    if (updatedTool[0] === 0) {
      return res.status(404).send({ message: "No tool was updated" });
    }

    res.status(200).send({ message: "Tool updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTool = async (req, res) => {
  try {
    const toolId = req.params.id;

    const foundTool = await Tool.findByPk(toolId);

    if (!foundTool) {
      return res.status(404).send({ message: "Tool not found" });
    }

    await Tool.destroy({
      where: { id: toolId },
    });

    res.status(200).send({ message: "Tool deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addTool,
  getToolById,
  getTools,
  updateTool,
  deleteTool,
};
