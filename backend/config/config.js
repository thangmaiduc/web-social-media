require('dotenv').config()
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    logging: true,
    dialect: "mysql",
  },
  development1: {
    username: "admin",
    password: "123",
    database: "test",
    host: "localhost",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: true,
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    dialect: "mysql",
    logging: true,
  },
};
