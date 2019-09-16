const { connection } = require("../db/connection.js");

exports.selectTopics = () => {
  return connection("topics").then(() => {
    return connection.select("*").from("topics");
  });
};
