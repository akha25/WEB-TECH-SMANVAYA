const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const FoodLog = sequelize.define('FoodLog', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  protein: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  carbs: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  fat: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  mealType: {
    type: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack'),
    defaultValue: 'Breakfast',
  },
});

module.exports = FoodLog;
