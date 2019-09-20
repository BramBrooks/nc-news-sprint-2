const commentsRouter = require("express").Router();

const {
  patchCommentByCommentId,
  deleteCommentByCommentId
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:commentId")
  .patch(patchCommentByCommentId)
  .delete(deleteCommentByCommentId);

module.exports = commentsRouter;
