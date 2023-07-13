const express = require("express");
const User = require("./../Models/UserModel");
const jwt = require("jsonwebtoken");
const { Error_Messages } = require("../constants");
const secretKey = "thisisthesecretkey12345";

const tokenSign = async (req, res, next) => {
  const [user] = await User.find({ email: req.body.email });
  if (user) {
    const payload = {
      _id: user._id,
    };
    const token = jwt.sign(payload, secretKey);
    req.jwttoken = token;
    next();
  } else {
    res.status(404).send({ message: Error_Messages.Not_Found });
  }
};

const authenticate = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).send("Not Authorized By JWT");
      }
      req.user = user._id;
      next();
    });
  } else {
    res.status(401).send("UnAuthorized to Access");
  }
};

module.exports = { tokenSign, authenticate };
