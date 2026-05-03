const { Sequelize } = require('sequelize');

// 🔍 DEBUG: check env values
console.log("ENV CHECK:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "****" : undefined,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT
});

// ✅ Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306, // 🔥 FIX: ensure number
    dialect: 'mysql',
    logging: false
  }
);

// 🔹 Test connection immediately
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection successful");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
}

testConnection();

module.exports = sequelize;