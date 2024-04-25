const shareValueModel = require('../models/shareValueModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//create share value
const createShareValue = catchAsync(async (req, res, next) => {
  const shareValueData = await shareValueModel.create({
    value: req.body.value,
  });

  res.status(201).json({
    status: 'success',
    data: shareValueData,
  });
});

// update share value
const updateShareValue = catchAsync(async (req, res, next) => {
  const updatedValue = await shareValueModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      value: updatedValue,
    },
  });
});

// get share value info
const getShareValue = catchAsync(async (req, res, next) => {
  const shareValue = await shareValueModel.findById(req.params.id);

  if (!shareValue) {
    return next(new AppError('No share value found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      value: shareValue,
    },
  });
});

module.exports = { createShareValue, updateShareValue, getShareValue };
