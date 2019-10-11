const connection = require("../db/connection.js");

exports.selectTopics = () => {
  return connection.select("*").from("topics");
};

exports.topicChecker = topic => {
  return connection
    .select("topics.*")

    .from("topics")
    .where("topics.slug", "=", topic)
    .then(topicArray => {
      if (!topicArray.length) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
    });
};

exports.authorChecker = author => {
  return connection
    .select("users.*")
    .from("users")
    .where("users.username", "=", author)
    .then(authorArray => {
      if (!authorArray.length) {
        return Promise.reject({ status: 404, msg: "Author not found" });
      }
    });
};
