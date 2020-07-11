// Update with your config settings.

import Knex from "knex";

import dotenv from "dotenv";
dotenv.config();

const conf: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    filename: process.env.DB_FILENAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME,
    charset: "utf8",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations",
    extension: "ts",
  },
  useNullAsDefault: true,
};

module.exports = conf;
