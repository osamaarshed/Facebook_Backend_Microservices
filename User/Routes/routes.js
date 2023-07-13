const express = require("express");
const router = express.Router();

const app = express();
const user = require("./user");
const ErrorHandler = require("../Middlewares/errorHandling");

router.use("/", user, ErrorHandler);

module.exports = router;
