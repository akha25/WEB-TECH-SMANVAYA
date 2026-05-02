require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/utils/db');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

sequelize.sync().then(() => {
  console.log('Database connected and synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
