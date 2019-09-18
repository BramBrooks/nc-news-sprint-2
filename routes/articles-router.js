const articlesRouter = require("express").Router();

const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId
} = require("../controllers/articles-controller.js");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

module.exports = articlesRouter;
