const { Sequelize } = require('sequelize');

let sequelize;

// If we are in production OR the user has configured a real DB_HOST, use MySQL
if (process.env.NODE_ENV === 'production' || (process.env.DB_HOST && process.env.DB_HOST !== 'your_remote_db_host')) {
  console.log("🌍 Connecting to remote MySQL Database...");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false, // disabled logging for production
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    }
  );
} else {
  // Otherwise, fallback to local SQLite
  console.log("🏠 Connecting to local SQLite Database...");
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
}

// 🔹 Test connection immediately
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful");
    
    // Auto-sync for local dev
    if (process.env.NODE_ENV !== 'production' && (!process.env.DB_HOST || process.env.DB_HOST === 'your_remote_db_host')) {
       await sequelize.sync({ alter: true });
       console.log("✅ Local Database synchronized");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

testConnection();

module.exports = sequelize;