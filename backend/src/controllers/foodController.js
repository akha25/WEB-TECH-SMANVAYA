const { FoodLog } = require('../models');

exports.createFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).send(log);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getFoodLogs = async (req, res) => {
  try {
    const { date } = req.query;
    const where = { userId: req.user.id };
    if (date) {
      where.date = date;
    }
    const logs = await FoodLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteFoodLog = async (req, res) => {
  try {
    const log = await FoodLog.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!log) {
      return res.status(404).send({ error: 'Food log not found' });
    }
    await log.destroy();
    res.send({ message: 'Food log deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
};
