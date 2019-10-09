const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics-controller");

topicsRouter.route("/").get(getTopics);

topicsRouter.all("/*", (req, res, next) =>
  next({ status: 405, msg: "Method Not Allowed" })
);

module.exports = topicsRouter;
