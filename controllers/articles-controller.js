const {
  selectArticleById,
  updateArticleById
} = require("../models/articles-model.js");

const { insertCommentByArticleId } = require("../models/comments-model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;

  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then(updatedArticle => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req.body;

  insertCommentByArticleId(article_id, body)
    .then(insertedComment => {
      res.status(200).send({ insertedComment });
    })
    .catch(next);
};
