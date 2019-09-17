const { selectArticleById } = require("../models/articles-model.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(article => {
      // console.log(article, "<-- article from controller");
      res.status(200).send({ article });
    })
    .catch(next);
};
