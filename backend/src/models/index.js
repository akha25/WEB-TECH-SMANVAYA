const User = require('./User');
const HealthLog = require('./HealthLog');
const Request = require('./Request');
const Badge = require('./Badge');
const FoodLog = require('./FoodLog');
const Goal = require('./Goal');
const Workout = require('./Workout');
const Post = require('./Post');
const Supplement = require('./Supplement');

// Associations
User.hasMany(HealthLog, { foreignKey: 'userId' });
HealthLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Request, { foreignKey: 'userId' });
Request.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Badge, { foreignKey: 'userId' });
Badge.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(FoodLog, { foreignKey: 'userId' });
FoodLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Goal, { foreignKey: 'userId' });
Goal.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Supplement, { foreignKey: 'userId' });
Supplement.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  HealthLog,
  Request,
  Badge,
  FoodLog,
  Goal,
  Workout,
  Post,
  Supplement,
};
