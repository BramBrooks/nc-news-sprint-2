const { updateCommentByCommentId } = require("../models/comments-model");

exports.patchCommentByCommentId = (req, res, next) => {
  // console.log("in the comments controller!");
  const { commentId } = req.params;
  const { inc_votes } = req.body;

  updateCommentByCommentId(commentId, inc_votes)
    .then(updatedComment => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};
