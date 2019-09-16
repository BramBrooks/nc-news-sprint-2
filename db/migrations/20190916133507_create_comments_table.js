exports.up = function(knex) {
  console.log("Creating comments table....");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary(); // what format is the comment_id? Is it a number?
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes", [0]);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body");
  });
};

exports.down = function(knex) {
  console.log("Removing comments tables...");
  return knex.schema.dropTable("comments");
};
