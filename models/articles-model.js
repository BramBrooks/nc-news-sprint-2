const { connection } = require("../db/connection");

exports.selectArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.comment_id as comment_count")
    .groupBy("articles.article_id")
    .then(articleArray => {
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        const formattedObjArr = articleArray.map(articleObj => {
          const newObj = { ...articleObj };

          const stringCommentCount = Number(articleObj.comment_count);

          newObj.comment_count = stringCommentCount;

          return newObj;
        });

        return formattedObjArr[0];
      }
    });
};

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return connection
    .from("articles")
    .where("article_id", "=", article_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(articleArray => {
      if (articleArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found - Article id does not exist"
        });
      } else {
        return articleArray[0];
      }
    });
};

exports.selectAllArticles = (sort_by, order_by, author, topic) => {
  const column = sort_by || "created_at";
  const order = order_by || "desc";

  const columnList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count"
  ];

  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.comment_id as comment_count")
    .groupBy("articles.article_id")
    .returning("*")
    .orderBy(column, order)
    .then(articlesArray => {
      if (!columnList.includes(column)) {
        Promise.reject({
          status: 400,
          msg: "Bad Request - Invalid Column For Sorting"
        });
      } else {
        if (author) {
          return articlesArray.filter(article => (article.author = author));
        } else {
          if (topic) {
            return articlesArray.filter(article => (article.topic = topic));
          }
        }
        return articlesArray;
      }
    });
};

exports.checkArticleExists = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .then(articleArray => {
      if (!articleArray.length) {
        return Promise.reject({ status: 404, msg: "Article Does Not Exist" });
      }
    });
};
