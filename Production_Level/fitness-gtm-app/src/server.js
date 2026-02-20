require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use("/api", routes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server running");
});