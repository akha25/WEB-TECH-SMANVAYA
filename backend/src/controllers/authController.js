const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'samanvaya_secret_key', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = generateToken(user.id);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    const token = generateToken(user.id);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.send(req.user);
};

exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name', 'email', 'height', 'weight', 'goal', 'dob', 'activityLevel', 'allergies',
    'dailyStepGoal', 'dailyCalorieGoal', 'dailyWaterGoal', 'dailySleepGoal'
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};
