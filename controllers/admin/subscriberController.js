const Subscriber = require('../../models/subscriberModel');
const { createOne, getAllDocs, deleteOne } = require('../handleFactory');

const addSubscriber = createOne(Subscriber);

const getAllSubscribers = getAllDocs(Subscriber);

const removeSubscriber = deleteOne(Subscriber);

module.exports = {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
};
