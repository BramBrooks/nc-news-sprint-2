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
      const formattedObjArr = articleArray.map(articleObj => {
        const newObj = { ...articleObj };

        const stringCommentCount = Number(articleObj.comment_count);

        newObj.comment_count = stringCommentCount;
        // console.log(newObj, "<--newObj");
        return newObj;
      });
      console.log(formattedObjArr[0], "formattedObj");
      return formattedObjArr[0];
    })
    .catch(err => {
      console.log(err);
    });
};
