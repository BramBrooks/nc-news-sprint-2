const {
  updateCommentByCommentId,
  removeCommentByCommentId
} = require("../models/comments-model");

exports.patchCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;
  const { inc_votes } = req.body;

  updateCommentByCommentId(commentId, inc_votes)
    .then(updatedComment => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { commentId } = req.params;

  removeCommentByCommentId(commentId)
    .then(commentsArray => {
      res.sendStatus(204);
    })
    .catch(next);
};
