const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      return Promise.all([topicsInsertions, usersInsertions]);
    })

    .then(() => {
      // console.log("Inserted topics and users okay...");

      const formattedArticles = formatDates(articleData);
      return knex("articles").insert(formattedArticles).returning("*");

      /* 
      
      Your article data is currently in the incorrect format and will violate your SQL schema. 
      
      You will need to write and test the provided formatDate utility function to be able insert your article data.

      Your comment insertions will depend on information from the seeded articles, so make sure to return the data after it's been seeded.
      */
    })
    .then((articleRows) => {
      // console.log("Inserted articles OK...");

      /* 

      Your comment data is currently in the incorrect format and will violate your SQL schema. 

      Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
      
      You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
      */
      // console.log(articleRows, "<----articleRows");
      const articleRef = makeRefObj(articleRows);
      // console.log(articleRef, "<----articleRef");
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
      // .then(console.log("Inserted comments OK..."));
      // .then(console.log(formattedComments));
    });
};
