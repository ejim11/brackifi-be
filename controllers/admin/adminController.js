const catchAsync = require('../../utils/catchAsync');
const Shareholder = require('../../models/shareholderModel');
const Orders = require('../../models/ordersModel');
const AppError = require('../../utils/appError');

const validateOrder = catchAsync(async (req, res, next) => {
  // changing the order to verified
  const order = await Orders.findByIdAndUpdate(
    req.body.orderId,
    { orderStatus: 'verified' },
    {
      new: true,
      runValidators: true,
    },
  );

  //   find
  const shareholder = await Shareholder.findById(order.shareholder.id);

  if (order.orderType === 'sell' && order.amount > shareholder.shareholding) {
    return next(new AppError('Amount is greater than shareholding', 400));
  }

  const holding =
    order.orderType === 'buy'
      ? shareholder.shareholding + order.amount
      : shareholder.shareholding - order.amount;

  const updateBody = {
    shareholding: holding,
  };

  //   update the shareholder
  await Shareholder.findByIdAndUpdate(order.shareholder.id, updateBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
  });
});

module.exports = {
  validateOrder,
};
