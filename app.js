const express = require("express");

const cors = require("cors");

const {
  handleCustomErrors,
  handle400PsqlErrors,
  handle404PsqlErrors,
  handleServerErrors,
  handleBadRouteErrors
} = require("./errors/index");

const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleBadRouteErrors);

app.use(handleCustomErrors);

app.use(handle400PsqlErrors);

app.use(handle404PsqlErrors);

app.use(handleServerErrors);

module.exports = app;
