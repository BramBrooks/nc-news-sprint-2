const express = require("express");

const {
  handleCustomErrors,
  handle400PsqlErrors,
  handle404PsqlErrors
} = require("./errors/index");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

app.use(handle400PsqlErrors);

app.use(handle404PsqlErrors);

module.exports = app;
