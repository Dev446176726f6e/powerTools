const express = require("express");
const config = require("config");
const PORT = config.get("port") || 4005;
const sequilize = require("./config/db");
const mainRouter = require("./routes/index.routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", mainRouter);

async function start() {
  try {
    await sequilize.authenticate();
    await sequilize.sync({ alter: true });
    console.log("Connection has been established successfully.");
    app.listen(PORT, () => {
      console.log(`Server running at :${PORT}`);
    });
  } catch (error) {
    console.error("Error starting or connecting server: ", error);
  }
}

start();
