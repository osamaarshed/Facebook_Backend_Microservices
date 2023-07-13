const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
const port = 8081;

//Importing Routes
const routes = require("./Routes/routes");
//Mongo Connection
mongoose.connect("mongodb://localhost:27017/facebook");

//Routes
app.use("/", routes);

app.listen(port, () => {
  console.log("Posts running on port: " + port);
});
