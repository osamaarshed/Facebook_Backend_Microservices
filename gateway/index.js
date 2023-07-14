const express = require("express");
require("dotenv").config();
const cors = require("cors");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const PORT = process.env.GATEWAY_PORT;
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
};

// app.use(cors());
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/posts", proxy(`http://localhost:${process.env.POSTS_PORT}/`)); // Posts and Comments
app.use("/messages", proxy(`http://localhost:${process.env.MESSAGES_PORT}/`)); // Messages
app.use(
  "/addfriends",
  proxy(`http://localhost:${process.env.ADDFRIENDS_PORT}/`)
); //Add Friends
app.use("/", proxy(`http://localhost:${process.env.USER_PORT}/`)); // Users

app.listen(PORT, () => {
  console.log(`Gateway Listening on Port ${PORT}`);
});
