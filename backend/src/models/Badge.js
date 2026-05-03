const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Badge = sequelize.define('Badge', {
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
  icon: {
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.STRING,
  },
  earned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Badge;
