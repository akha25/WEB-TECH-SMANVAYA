const { Sequelize } = require('sequelize');

// 🔹 Validate required env variables
const requiredEnv = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}

// 🔹 Create Sequelize instance (MySQL ONLY)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
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

// 🔹 Test DB connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Database connected successfully");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    process.exit(1); // 🔥 stop app if DB fails
  }
}

testConnection();

module.exports = sequelize;