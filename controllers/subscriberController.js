const Subscriber = require('../models/subscriberModel');

async function addSubscriber(req, res) {
  try {
    const newSubscriber = await Subscriber.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        newSubscriber,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    });
  }
}

async function getAllSubscribers(req, res) {
  try {
    const allSubscribers = await Subscriber.find();
    res.status(200).json({
      status: 'success',
      results: allSubscribers.length,
      data: {
        allSubscribers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err.message,
    });
  }
}

async function removeSubscriber(req, res) {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: `Invalid data sent`,
    });
  }
}

module.exports = {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
};
