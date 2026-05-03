const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'volunteer', 'admin'),
    defaultValue: 'user',
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  },
  goal: {
    type: DataTypes.STRING,
    defaultValue: 'Maintain Weight',
  },
  dailyStepGoal: {
    type: DataTypes.INTEGER,
    defaultValue: 8000,
  },
  dailyCalorieGoal: {
    type: DataTypes.INTEGER,
    defaultValue: 2200,
  },
  dailyWaterGoal: {
    type: DataTypes.FLOAT,
    defaultValue: 3.0,
  },
  dailySleepGoal: {
    type: DataTypes.FLOAT,
    defaultValue: 8.0,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  height: {
    type: DataTypes.FLOAT,
  },
  weight: {
    type: DataTypes.FLOAT,
  },
  activityLevel: {
    type: DataTypes.STRING,
  },
  allergies: {
    type: DataTypes.TEXT,
  },
  joined: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = User;
