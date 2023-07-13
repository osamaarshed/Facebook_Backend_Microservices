const express = require("express");
const router = express.Router();

const app = express();
const { authenticate } = require("../Middlewares/token");
const messages = require("./messages");
const ErrorHandler = require("../Middlewares/errorHandling");

router.use("/", authenticate, messages, ErrorHandler);

module.exports = router;
