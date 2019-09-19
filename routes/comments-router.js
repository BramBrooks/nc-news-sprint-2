const commentsRouter = require("express").Router();

const {
  patchCommentByCommentId
} = require("../controllers/comments-controller");

commentsRouter.route("/:commentId").patch(patchCommentByCommentId);

module.exports = commentsRouter;
