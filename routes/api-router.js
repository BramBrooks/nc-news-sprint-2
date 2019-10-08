const apiRouter = require("express").Router();

const topicsRouter = require("./topics-router");

const usersRouter = require("./users-router");

const articlesRouter = require("./articles-router");

const commentsRouter = require("./comments-router");

// const api_JSON_Router = require("./json-");

// apiRouter.use("", api_JSON_Router);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/*", (req, res, next) =>
  next({ status: 405, msg: "Method Not Allowed" })
);

module.exports = apiRouter;
