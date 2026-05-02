const { Workout } = require('../models');

exports.createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).send(workout);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.send(workouts);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!workout) {
      return res.status(404).send({ error: 'Workout not found' });
    }
    await workout.destroy();
    res.send({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
};
