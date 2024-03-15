const Subscriber = require('../models/subscriberModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const addSubscriber = catchAsync(async (req, res, next) => {
  const newSubscriber = await Subscriber.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newSubscriber,
    },
  });
});

const getAllSubscribers = catchAsync(async (req, res, next) => {
  const allSubscribers = await Subscriber.find();

  res.status(200).json({
    status: 'success',
    results: allSubscribers.length,
    data: {
      allSubscribers,
    },
  });
});

const removeSubscriber = catchAsync(async (req, res, next) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

  if (!subscriber) {
    return next(new AppError('No subscriber found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
};
