const { Goal } = require('../models');

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).send(goal);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.send(goals);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!goal) {
      return res.status(404).send({ error: 'Goal not found' });
    }
    
    goal.currentValue = req.body.currentValue;
    
    // Calculate milestones
    const progress = (goal.currentValue / goal.targetValue) * 100;
    const milestones = [25, 50, 75, 100];
    const reached = milestones.filter(m => progress >= m && !goal.milestonesReached.includes(m));
    
    if (reached.length > 0) {
      goal.milestonesReached = [...goal.milestonesReached, ...reached];
    }
    
    if (progress >= 100) {
      goal.status = 'Completed';
    }
    
    await goal.save();
    res.send(goal);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!goal) {
      return res.status(404).send({ error: 'Goal not found' });
    }
    await goal.destroy();
    res.send({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
};
