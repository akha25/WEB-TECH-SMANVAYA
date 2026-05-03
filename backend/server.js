require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/utils/db');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Test endpoint for Render
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

sequelize.sync().then(() => {
  console.log('Database connected and synced');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Database connection failed:', err);
});
