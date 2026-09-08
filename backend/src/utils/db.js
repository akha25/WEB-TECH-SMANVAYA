const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Determine dialect: default to sqlite if DB_DIALECT is 'sqlite' or if MySQL env vars are missing
const isSqlite = process.env.DB_DIALECT === 'sqlite' || 
  (!process.env.DB_HOST && !process.env.DB_NAME) || 
  process.env.DB_DIALECT !== 'mysql';

let sequelize;

if (isSqlite) {
  const dbPath = process.env.DB_STORAGE 
    ? path.resolve(process.env.DB_STORAGE) 
    : path.resolve(__dirname, '../../database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
  console.log(`📦 Database configured with SQLite at: ${dbPath}`);
} else {
  // MySQL Configuration
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: process.env.DB_SSL === 'true'
        ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
        : {},
    }
  );
  console.log(`🐬 Database configured with MySQL on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
}

module.exports = sequelize;