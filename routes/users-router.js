const usersRouter = require("express").Router();

const { getUserByUsername } = require("../controllers/users-controller");

usersRouter.route("/users/:username").get(getUserByUsername);

module.exports = usersRouter;

// UP TO HERE
