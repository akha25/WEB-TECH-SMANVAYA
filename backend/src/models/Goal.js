const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Weight Loss', 'Steps Challenge', 'Sleep Improvement', 'Water Intake', 'Meditation Streak'),
    allowNull: false,
  },
  targetValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentValue: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deadline: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'Failed'),
    defaultValue: 'Active',
  },
  milestonesReached: {
    type: DataTypes.JSON, // [25, 50, 75, 100]
    defaultValue: [],
  },
});

module.exports = Goal;
