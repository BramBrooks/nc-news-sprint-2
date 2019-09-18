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
      // console.log(articleArray);
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        const formattedObjArr = articleArray.map(articleObj => {
          const newObj = { ...articleObj };

          const stringCommentCount = Number(articleObj.comment_count);

          newObj.comment_count = stringCommentCount;
          // console.log(newObj, "<--newObj");
          return newObj;
        });

        // console.log(formattedObjArr[0], "<----- formattedObj");
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
