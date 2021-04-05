const ENV = process.env.NODE_ENV || "development";

const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

// should this be customConfigs
const customConfig = {
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },

  development: {
    connection: {
      database: "nc_news",
      // username,
      // password
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      // username,
      // password
    },
  },

  // original code for production:
  // production: {
  //   connection: `${DB_URL}?ssl=true`,
  // },
};

const tryThisAgain = { ...customConfig[ENV], ...baseConfig };

module.exports = tryThisAgain;
