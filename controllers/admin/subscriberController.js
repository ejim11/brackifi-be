const Subscriber = require('../../models/subscriberModel');
const { getAllDocs, deleteOne } = require('../handleFactory');
const catchAsync = require('../../utils/catchAsync');
const Email = require('../../utils/email');

const addSubscriber = catchAsync(async (req, res, next) => {
  const newSubscriber = await Subscriber.create(req.body);

  const url = ``;

  new Email(newSubscriber, url).sendSubscribed();

  res.status(201).json({
    status: 'success',
    data: {
      newSubscriber,
    },
  });
});

// const addSubscriber = createOne(Subscriber);

const getAllSubscribers = getAllDocs(Subscriber);

const removeSubscriber = deleteOne(Subscriber);

module.exports = {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
};
