const { connection } = require("../db/connection");

exports.insertCommentByArticleId = (article_id, body, username) => {
  return connection("comments")
    .insert({ article_id: article_id, body: body, author: username })
    .returning("*")
    .then(commentArray => {
      if (commentArray[0].body.length === 0) {
        return Promise.reject({ status: 400, msg: "No comment provided!" });
      } else {
        return commentArray[0];
      }
    });
};

exports.selectCommentsByArticleId = (article_id, sort_by, order_by) => {
  const column = sort_by || "created_at";
  const order = order_by || "desc";
  const columnList = ["comment_id", "votes", "created_at", "author", "body"];

  return connection("comments")
    .select("comment_id", "votes", "created_at", "author", "body")

    .where("article_id", "=", article_id)
    .orderBy(column, order)

    .then(commentsArray => {
      if (!columnList.includes(column)) {
        Promise.reject({
          status: 400,
          msg: "Bad Request - Invalid Column For Sorting"
        });
      } else {
        return commentsArray;
      }
    });
};

exports.updateCommentByCommentId = (comment_id, inc_votes) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment({ votes: inc_votes })
    .returning("*")
    .then(commentArray => {
      if (commentArray.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Does Not Exist" });
      } else {
        return commentArray[0];
      }
    });
};

exports.removeCommentByCommentId = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
