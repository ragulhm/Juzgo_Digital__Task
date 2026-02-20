const express = require("express");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();

app.use(express.json());

app.use("/api", routes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});