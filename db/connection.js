const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

// Updated version
const dbConfig =
  ENV === "production"
    ? {
        client: "pg",
        connection: {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : require("../knexfile");

// original code

// const dbConfig =
//   ENV === "production"
//     ? { client: "pg", connection: process.env.DATABASE_URL }
//     : require("../knexfile").default;

const connection = knex(dbConfig);

module.exports = connection;

// module.exports = knex(dbConfig);
