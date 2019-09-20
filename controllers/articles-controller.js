const {
  selectArticleById,
  updateArticleById,
  selectAllArticles
} = require("../models/articles-model.js");

const {
  insertCommentByArticleId,
  selectCommentsByArticleId
} = require("../models/comments-model");

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
  const { username } = req.body;

  insertCommentByArticleId(article_id, body, username)
    .then(insertedComment => {
      res.status(200).send({ insertedComment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order_by } = req.query;

  selectCommentsByArticleId(article_id, sort_by, order_by)
    .then(selectedComments => {
      res.status(200).send(selectedComments);
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order_by, author, topic } = req.query;

  selectAllArticles(sort_by, order_by, author, topic)
    .then(selectedArticles => {
      res.status(200).send(selectedArticles);
    })
    .catch(next);
};
