const { Supplement } = require('../models');

exports.getSupplements = async (req, res) => {
  try {
    const supplements = await Supplement.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC'], ['timeTaken', 'ASC']]
    });
    res.json(supplements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(supplement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSupplement = async (req, res) => {
  try {
    const supplement = await Supplement.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!supplement) return res.status(404).json({ message: 'Supplement not found' });
    await supplement.destroy();
    res.json({ message: 'Supplement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
