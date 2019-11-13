const usersRouter = require("express").Router();

const { getAllUsers, getUser } = require("../controllers/users-controller");

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/:username").get(getUser);

usersRouter.all("/*", (req, res, next) =>
  next({ status: 405, msg: "Method Not Allowed" })
);

module.exports = usersRouter;
