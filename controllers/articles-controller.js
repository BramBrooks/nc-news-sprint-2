const {
  selectArticleById
  // ,updateArticleById
} = require("../models/articles-model.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then(article => {
      // console.log(article, "<-- article from controller");
      res.status(200).send({ article });
    })
    .catch(next);
};

// exports.patchArticleById = (req, res, next) => {
//   const { article_id } = req.params;
//   updateArticleById(article_id)
//     .then(updatedArticle => {
//       console.log(updatedArticle, "<-- updatedArticle from controller");
//       res.status(200).send({ article });
//     })
//     .catch(next);
// };
