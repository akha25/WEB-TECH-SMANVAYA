const { HealthLog } = require('../models');

exports.createLog = async (req, res) => {
  try {
    const { date } = req.body;
    
    // Check if log already exists for this date
    let log = await HealthLog.findOne({
      where: { 
        userId: req.user.id,
        date: date
      }
    });

    if (log) {
      // Update existing log
      await log.update(req.body);
      return res.json(log);
    }

    // Create new log
    log = await HealthLog.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await HealthLog.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getStats = async (req, res) => {
  try {
    const logs = await HealthLog.findAll({
      where: { userId: req.user.id },
      order: [['date', 'ASC']],
    });
    // Basic aggregation can be done here or in the frontend
    res.send(logs);
  } catch (error) {
    res.status(500).send(error);
  }
};
