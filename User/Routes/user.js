const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../Controllers/user-controller");
const { tokenSign } = require("../Middlewares/token");

//Create
router.post("/signup", signUp);

//Signin
router.post("/signin", tokenSign, signIn);

module.exports = router;
