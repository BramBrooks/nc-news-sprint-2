const articlesRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getAllArticles
} = require("../controllers/articles-controller.js");

articlesRouter.route("").get(getAllArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId);

articlesRouter.all("/*", (req, res, next) =>
  next({ status: 405, msg: "Method Not Allowed" })
);

module.exports = articlesRouter;
