const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Supplement = sequelize.define('Supplement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
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
