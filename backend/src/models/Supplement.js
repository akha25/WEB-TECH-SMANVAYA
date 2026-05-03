const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Supplement = sequelize.define('Supplement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
  },
  timeTaken: {
    type: DataTypes.STRING, // e.g., "08:00 AM"
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  }
});

module.exports = Supplement;
