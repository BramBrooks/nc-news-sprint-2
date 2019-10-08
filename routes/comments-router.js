const commentsRouter = require("express").Router();

const {
  patchCommentByCommentId,
  deleteCommentByCommentId
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:commentId")
  .patch(patchCommentByCommentId)
  .delete(deleteCommentByCommentId);

// commentsRouter.all("/*", (req, res, next) =>
//   next({ status: 405, msg: "Method Not Allowed" })
// );

module.exports = commentsRouter;
