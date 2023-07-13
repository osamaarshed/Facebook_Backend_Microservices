const express = require("express");
const router = express.Router();

const app = express();
const { authenticate } = require("../Middlewares/token");
const addFriends = require("./addFriends");
const ErrorHandler = require("../Middlewares/errorHandling");

router.use("/", authenticate, addFriends, ErrorHandler);

module.exports = router;
