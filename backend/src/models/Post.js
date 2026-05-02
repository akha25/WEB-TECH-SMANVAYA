const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Post = sequelize.define('Post', {
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
  userAvatar: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Achievement', 'Tip', 'Recipe', 'Motivation'),
    defaultValue: 'Tip',
  },
  reactions: {
    type: DataTypes.JSON, // { ❤️: 0, 👏: 0, 💪: 0, 🔥: 0, ✨: 0 }
    defaultValue: { '❤️': 0, '👏': 0, '💪': 0, '🔥': 0, '✨': 0 },
  },
  metricAttachment: {
    type: DataTypes.JSON, // { type: 'steps', value: 10000 }
  },
});

module.exports = Post;
