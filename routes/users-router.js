const usersRouter = require("express").Router();

const { getUser } = require("../controllers/users-controller");

usersRouter.route("/:username").get(getUser);

usersRouter.all("/*", (req, res, next) =>
  next({ status: 405, msg: "Method Not Allowed" })
);

module.exports = usersRouter;
