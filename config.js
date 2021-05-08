require('dotenv').config();

module.exports = {
  port: process.env[`${process.env.NODE_ENV}_PORT`],
  databaseHost: process.env[`${process.env.NODE_ENV}_DB_HOST`],
  databaseUser: process.env[`${process.env.NODE_ENV}_DB_USER`],
  databasePassword: process.env[`${process.env.NODE_ENV}_DB_PASSWORD`],
  databaseName: process.env[`${process.env.NODE_ENV}_DB_NAME`],
  databaseInitial: process.env[`${process.env.NODE_ENV}_DB_INITIAL`],
  bodyEncryption: false,
  tokenkey: 'uOUANxkK3O',
};
