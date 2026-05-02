const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const HealthLog = sequelize.define('HealthLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  steps: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  water: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  sleep: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  mood: {
    type: DataTypes.STRING,
  },
  heartRate: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = HealthLog;
