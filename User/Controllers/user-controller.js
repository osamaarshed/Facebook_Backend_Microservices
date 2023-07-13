const express = require("express");
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { Error_Messages, Success_Messages } = require("../constants");

const signUp = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const confirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);

    if (req.body.password === req.body.confirmpassword) {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpassword,
      });
      await res.status(201).send({ message: Success_Messages.Created });
    } else {
      res.status(401).send({ message: Error_Messages.Password });
    }
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      res.status(200).send({
        message: Success_Messages.Login,
        jwt: req.jwttoken,
      });
    } else {
      res.status(401).send({ message: Error_Messages.Wrong_Password });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, signIn };
