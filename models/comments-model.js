const { connection } = require("../db/connection");

exports.insertCommentByArticleId = (article_id, body, username) => {
  if (!body || !username) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else {
    return connection("comments")
      .insert({ article_id: article_id, body: body, author: username })
      .returning("*")
      .then(commentArray => {
        return commentArray[0];
      });
  }
};

exports.selectCommentsByArticleId = (article_id, sort_by, order_by) => {
  const column = sort_by || "created_at";
  const order = order_by || "desc";
  const columnList = ["comment_id", "votes", "created_at", "author", "body"];

  if (!columnList.includes(column)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request - Invalid Column For Sorting"
    });
  } else {
    return connection("comments")
      .select("comment_id", "votes", "created_at", "author", "body")

      .where("article_id", "=", article_id)
      .orderBy(column, order)

      .then(commentsArray => {
        return commentsArray;
      });
  }
};

exports.updateCommentByCommentId = (comment_id, inc_votes = 0) => {
  return connection
    .select("comments.*")
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

exports.checkCommentExists = comment_id => {
  return connection
    .select("comments.*")
    .from("comments")
    .where("comments.comment_id", "=", comment_id)
    .then(commentArray => {
      if (!commentArray.length) {
        return Promise.reject({ status: 404, msg: "Comment Does Not Exist" });
      }
    });
};

exports.removeCommentByCommentId = comment_id => {
  return connection
    .select("comments.*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del();
};
