const Subscriber = require('../../models/subscriberModel');
const { getAllDocs, deleteOne } = require('../handleFactory');
const catchAsync = require('../../utils/catchAsync');
const Email = require('../../utils/email');
const AppError = require('../../utils/appError');

const addSubscriber = catchAsync(async (req, res, next) => {
  const newSubscriber = await Subscriber.create(req.body);

  const url = `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_HOST : process.env.WEB_HOST}/api/v1/subscribers/unsubscribe/?subscriberId=${newSubscriber._id}`;

  new Email(newSubscriber, url).sendSubscribed();

  res.status(201).json({
    status: 'success',
    data: {
      newSubscriber,
    },
  });
});

const unsubscribe = catchAsync(async (req, res, next) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.query.subscriberId);

  if (!subscriber) {
    return next(new AppError('No Doc found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// const addSubscriber = createOne(Subscriber);

const getAllSubscribers = getAllDocs(Subscriber);

const removeSubscriber = deleteOne(Subscriber);

module.exports = {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
  unsubscribe,
};
