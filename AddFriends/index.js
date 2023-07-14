const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.ADDFRIENDS_PORT;

//Importing Routes
const routes = require("./Routes/routes");
//Mongo Connection
mongoose
  .connect(process.env.MONGODB_CONNECT)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

//Routes
app.use("/", routes);

const server = app.listen(port, () => {
  console.log("Add Friends running on port: " + port);
});
