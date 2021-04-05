const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data/index");

const devData = require("./development-data/index");

const data = { development: devData, test: testData, production: devData };

const doesItWork = data[ENV];

// this is just a change from module.exports = data[ENV]

module.exports = doesItWork;
