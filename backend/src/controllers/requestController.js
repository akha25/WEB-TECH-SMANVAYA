const { Request } = require('../models');

exports.createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      userId: req.user.id,
      userName: req.user.name,
    });
    res.status(201).send(request);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });
    res.send(requests);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [['date', 'DESC']],
    });
    res.send(requests);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resolveRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) {
      return res.status(404).send({ error: 'Request not found' });
    }
    request.status = 'Resolved';
    request.response = req.body.response;
    await request.save();
    res.send(request);
  } catch (error) {
    res.status(400).send(error);
  }
};
