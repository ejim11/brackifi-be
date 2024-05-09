const Orders = require('../models/ordersModel');

const {
  createOne,
  getAllDocs,
  getOne,
  updateOne,
  deleteOne,
} = require('./handleFactory');

const setShareholderId = (req, res, next) => {
  if (!req.body.shareholder) req.body.shareholder = req.shareholder.id;
  next();
};

// // create an order
const createOrder = createOne(Orders);

// get all orders
const getAllOrders = getAllDocs(Orders);

// get a particular order
const getOrder = getOne(Orders);

// update an order
const updateOrder = updateOne(Orders);

// Delete an order
const deleteOrder = deleteOne(Orders);

module.exports = {
  createOrder,
  setShareholderId,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
