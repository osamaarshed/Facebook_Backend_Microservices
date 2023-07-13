const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", proxy("http://localhost:8081/")); // Posts and Comments
app.use("/messages", proxy("http://localhost:8083/")); // Messages
app.use("/addfriends", proxy("http://localhost:8084/")); //Add Friends
app.use("/", proxy("http://localhost:8082/")); // Users

app.listen(8080, () => {
  console.log("Gateway Listening on Port 8080");
});
