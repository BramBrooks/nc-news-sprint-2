const {
  selectArticleById,
  updateArticleById,
  selectAllArticles,
  checkArticleExists
} = require("../models/articles-model.js");

const {
  insertCommentByArticleId,
  selectCommentsByArticleId
} = require("../models/comments-model");

const { topicChecker, authorChecker } = require("../models/topics-model");

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
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req.body;
  const { username } = req.body;

  checkArticleExists(article_id).catch(next);
  //here

  return insertCommentByArticleId(article_id, body, username)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  checkArticleExists(article_id).catch(next);

  return selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;

  if (topic) {
    topicChecker(topic).catch(next);
  }

  if (author) {
    authorChecker(author).catch(next);
  }

  // Future improvement - work out how to combine the two above into one!!!

  return selectAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
