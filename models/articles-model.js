const { connection } = require("../db/connection");

exports.selectArticleById = article_id => {
  // console.log(article_id, "<---- article_id");

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
  // .catch(err => {
  //   console.log(err, "<------ error");
  // });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return connection
    .from("articles")
    .where("article_id", "=", article_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(articleArray => {
      // console.log(articleArray[0], "<-----articleArray");
      return articleArray[0];
    });
};

exports.selectAllArticles = () => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
      // "comment_count"
      // "*"
    )
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count("comments.comment_id as comment_count")
    .groupBy("articles.article_id")
    .returning("*")
    .then(articleArray => {
      // console.log(articleArray, "<------ articleArray");
      return articleArray;
    })
    .catch(err => {
      console.log(err, "<------ error");
    });
};
