const { connection } = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select(
      "title",
      "article_id",
      "body",
      "topic",
      "created_at",
      "votes",
      "author"
    )
    .from("articles")
    .where("article_id", "=", article_id)
    .then(articleArray => {
      console.log(articleArray, "<---article array");
      // return articleArray;
    });
};

exports.countCommentsByArticleId = article_id => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", "=", article_id)
    .then(commentsArray => {
      console.log(commentsArray, "commentsArray");
    });
};

// comment_count = total number of comments with this article_id. Use knex queries to achieve this
// select * from comments where article_id = articles.article_id.length
// maybe use a promise all?

// exports.selectArticleById = article_id => {
//  return connection
//   .select(
//    "title",
//    "article_id",
//    "body",
//    "topic",
//    "created_at",
//    "votes",
//    "author"
//   )
//   .from("articles")
//   .where("article_id", "=", article_id)
//   .then(articleArray => {
//    console.log(articleArray, "<---article array");
//    return articleArray;
//   });
// };
