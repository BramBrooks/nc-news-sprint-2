const articlesRouter = require("express").Router();

const { getArticleById } = require("../controllers/articles-controller.js");

articlesRouter.route("/:article_id").get(getArticleById);

module.exports = articlesRouter;
