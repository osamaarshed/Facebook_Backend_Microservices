const express = require("express");
const { Error_Messages } = require("../constants");

const errorHandler = (err, req, res, next) => {
  console.log("here");
  res.status(500).send({
    error: err.stack,
    message: Error_Messages.Server,
  });
};

module.exports = errorHandler;
