const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
const port = process.env.USER_PORT;

//Importing Routes
const routes = require("./Routes/routes");

//Routes
app.use("/", routes);

//Mongo Connection
mongoose
  .connect(process.env.MONGODB_CONNECT)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

app.listen(port, () => {
  console.log("User Running on port: " + port);
});
