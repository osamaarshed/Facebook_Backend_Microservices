const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
const port = 8082;

//Importing Routes
const routes = require("./Routes/routes");

//Mongo Connection
mongoose
  .connect("mongodb://localhost:27017/facebook")
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

//Routes
app.use("/", routes);

app.listen(port, () => {
  console.log("User Running on port: " + port);
});
