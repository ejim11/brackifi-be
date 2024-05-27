const ShareValue = require('../../models/shareValueModel');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { createOne } = require('../handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

//create share value
const createShareValue = createOne(ShareValue);

// update share value
const updateShareValue = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'value');

  const updatedValue = await ShareValue.findByIdAndUpdate(
    req.params.id,
    filteredBody,
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
  const shareValue = await ShareValue.findById(req.params.id);

  if (!shareValue) return next(new AppError('Share value not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      shareValue: {
        _id: shareValue._id,
        value: shareValue.value,
        history: shareValue.history.slice(-12),
      },
    },
  });
});

// update share value history
const updateShareValueHistory = catchAsync(async (req, res, next) => {
  const shareValue = await ShareValue.findById(req.params.id);

  if (!shareValue) {
    return next(new AppError('No share value found', 404));
  }

  shareValue.history = [...shareValue.history, req.body];
  shareValue.save();

  res.status(200).json({
    status: 'success',
    data: shareValue,
  });
});

module.exports = {
  createShareValue,
  updateShareValue,
  getShareValue,
  updateShareValueHistory,
};
