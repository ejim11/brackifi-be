const catchAsync = require('../../utils/catchAsync');
const Shareholder = require('../../models/shareholderModel');
const Orders = require('../../models/ordersModel');
const AppError = require('../../utils/appError');
const { activateOne } = require('../handleFactory');
const ShareValue = require('../../models/shareValueModel');
const Investor = require('../../models/investorModel');

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

  const shareValue = await ShareValue.findById(req.body.shareValueId);

  const val =
    order.orderType === 'buy'
      ? Math.round(order.amount / shareValue.value)
      : order.amount;

  if (order.orderType === 'sell' && val > shareholder.shareholding) {
    return next(new AppError('Amount is greater than shareholding', 400));
  }

  const holding =
    order.orderType === 'buy'
      ? shareholder.shareholding + val
      : shareholder.shareholding - val;

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

const activateUser = activateOne(Shareholder);

const activateInvestor = activateOne(Investor);

module.exports = {
  validateOrder,
  activateUser,
  activateInvestor,
};
