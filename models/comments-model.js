const { connection } = require("../db/connection");

exports.insertCommentByArticleId = (article_id, body) => {
  console.log("hello!");
  return connection
    .from("comments")
    .where("article_id", "=", article_id)
    .insert(body)
    .returning("*")
    .then(commentArray => {
      console.log(commentArray);
    });
};

// need to figure out the logic of how to pull in all the info
// look at the knex docs on insert!!!
