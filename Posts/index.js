const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
const port = process.env.POSTS_PORT;

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

app.listen(port, () => {
  console.log("Posts running on port: " + port);
});
