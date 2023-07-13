const express = require("express");
const router = express.Router();

const app = express();
const { authenticate } = require("../Middlewares/token");
const posts = require("./posts");
const comments = require("./comments");
const ErrorHandler = require("../Middlewares/errorHandling");

router.use("/", authenticate, posts, ErrorHandler);
router.use("/comments", authenticate, comments, ErrorHandler);

module.exports = router;
