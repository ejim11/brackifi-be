const Orders = require('../models/ordersModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const setShareholderId = (req, res, next) => {
  console.log(req.shareholder.id);
  if (!req.body.shareholder) req.body.shareholder = req.shareholder.id;
  next();
};

// create an order
const createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Orders.create({
    orderType: req.body.orderType,
    walletAddress: req.body.walletAddress,
    amount: req.body.amount,
    dateCreated: req.body.dateCreated,
    shareCost: req.body.shareCost,
    orderStatus: req.body.orderStatus,
    shareholder: req.body.shareholder,
  });

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

// get all orders
const getAllOrders = catchAsync(async (req, res, next) => {
  const allOrders = await Orders.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: allOrders.length,
    data: {
      orders: allOrders,
    },
  });
});

// get a particular order
const getOrder = catchAsync(async (req, res, next) => {
  const order = await Orders.findById(req.params.id);

  if (!order) {
    return next(new AppError('There is no order with this id', 404));
  }

  res.status(200).json({
    satus: 'success',
    data: {
      order,
    },
  });
});

// update an order
const updateOrder = catchAsync(async (req, res, next) => {
  // Create error if user posts password data
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400,
      ),
    );
  }

  // Update user document
  // filter the fields to what you want to change
  const filteredBody = filterObj(req.body, 'orderStatus');

  const updatedOrder = await Orders.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true },
  );

  if (!updatedOrder) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

// Delete an order
const deleteOrder = catchAsync(async (req, res, next) => {
  await Orders.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
  });
});

module.exports = {
  createOrder,
  setShareholderId,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
