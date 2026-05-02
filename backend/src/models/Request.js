const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Diet Plan', 'Workout Advice', 'Mental Wellness', 'Medical Query', 'Other'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Resolved'),
    defaultValue: 'Pending',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    defaultValue: 'Medium',
  },
  response: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Request;
