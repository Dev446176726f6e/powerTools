const errorHandler = (error, res) => {
  console.error(error);
  res.status(400).send({ error: error.message });
};

module.exports = {
  errorHandler,
};
