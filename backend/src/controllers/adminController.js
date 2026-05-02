const { User, HealthLog, Request } = require('../models');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalLogs = await HealthLog.count();
    const pendingRequests = await Request.count({ where: { status: 'Pending' } });
    const totalVolunteers = await User.count({ where: { role: 'volunteer' } });

    res.send({
      totalUsers,
      totalLogs,
      pendingRequests,
      totalVolunteers,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['joined', 'DESC']],
    });
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    user.role = req.body.role;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    await user.destroy();
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};
