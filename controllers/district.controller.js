const { errorHandler } = require("../helpers/error_handler");
const District = require("../models/district");

const addDistrict = async (req, res) => {
  try {
    const { name } = req.body;

    const newDistrict = await District.create({
      name,
    });

    res
      .status(201)
      .send({ message: "New district created", id: newDistrict.id });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDistrictById = async (req, res) => {
  try {
    const districtId = req.params.id;
    const foundDistrict = await District.findByPk(districtId);

    if (!foundDistrict) {
      return res.status(404).send({ message: "District not found" });
    }

    res.status(200).send(foundDistrict);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDistricts = async (req, res) => {
  try {
    const districts = await District.findAll();

    if (districts.length === 0) {
      return res.status(404).send({ message: "No districts found" });
    }

    res.status(200).send(districts);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDistrict = async (req, res) => {
  try {
    const { name } = req.body;
    const districtId = req.params.id;

    const foundDistrict = await District.findByPk(districtId);

    if (!foundDistrict) {
      return res.status(404).send({ message: "District not found" });
    }

    const updatedDistrict = await District.update(
      { name },
      { where: { id: districtId } }
    );

    if (updatedDistrict[0] === 0) {
      return res.status(404).send({ message: "No district was updated" });
    }

    res.status(200).send({ message: "District updated successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteDistrict = async (req, res) => {
  try {
    const districtId = req.params.id;

    const foundDistrict = await District.findByPk(districtId);

    if (!foundDistrict) {
      return res.status(404).send({ message: "District not found" });
    }

    await District.destroy({
      where: { id: districtId },
    });

    res.status(200).send({ message: "District deleted successfully" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addDistrict,
  getDistrictById,
  getDistricts,
  updateDistrict,
  deleteDistrict,
};
