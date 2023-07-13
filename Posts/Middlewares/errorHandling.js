const express = require("express");
const { Error_Messages } = require("../constants");

const errorHandler = (err, req, res, next) => {
  res.status(500).send({
    error: err.stack,
    message: Error_Messages.Server,
  });
};

module.exports = errorHandler;

// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ message: 'Internal Server Error' });
// }
