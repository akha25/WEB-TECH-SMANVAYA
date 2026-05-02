const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Workout = sequelize.define('Workout', {
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
  category: {
    type: DataTypes.ENUM('Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core/Abs', 'Cardio', 'Full Body', 'Yoga', 'Flexibility'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // minutes
    allowNull: true,
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  exercises: {
    type: DataTypes.JSON, // [{ name, sets: [{ reps, weight }], notes }]
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
  },
  intensity: {
    type: DataTypes.INTEGER, // 1-10
    defaultValue: 5,
  },
});

module.exports = Workout;
