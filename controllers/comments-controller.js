const {
  updateCommentByCommentId,
  removeCommentByCommentId,
  checkCommentExists
} = require("../models/comments-model");

exports.patchCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;

  updateCommentByCommentId(commentId, inc_votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;
  checkCommentExists(commentId).catch(next);

  return removeCommentByCommentId(commentId)
    .then(commentsArray => {
      res.sendStatus(204);
    })
    .catch(next);
};
