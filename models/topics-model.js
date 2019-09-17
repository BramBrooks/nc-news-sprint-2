const { connection } = require("../db/connection.js");

exports.selectTopics = () => {
  return connection.select("*").from("topics");
};
