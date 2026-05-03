// 🔹 Load env FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/utils/db'); // ✅ FIXED PATH
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔍 DEBUG (remove later)
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);

app.use(cors({ origin: "*" }));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

// Routes
app.use('/api', routes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 🔹 DB connection + server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced (alter: true)');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

startServer();