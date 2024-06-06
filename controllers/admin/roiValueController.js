const RoiValue = require('../../models/roiValueModel');
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
const createRoiValue = createOne(RoiValue);

// update share value
const updateRoiValue = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'value');

  const updatedValue = await RoiValue.findByIdAndUpdate(
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
const getRoiValue = catchAsync(async (req, res, next) => {
  const roiValue = await RoiValue.findById(req.params.id);

  if (!roiValue) return next(new AppError('Roi value not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      roiValue: {
        _id: roiValue._id,
        value: roiValue.value,
        performanceCommentary: roiValue.performanceCommentary,
        previousDayReport: roiValue.previousDayReport,
        history: roiValue.history.slice(-12),
      },
    },
  });
});

// update share value history
const updateRoiValueHistory = catchAsync(async (req, res, next) => {
  const roiValue = await RoiValue.findById(req.params.id);

  if (!roiValue) {
    return next(new AppError('No share value found', 404));
  }

  roiValue.history = [...roiValue.history, req.body];
  roiValue.save();

  res.status(200).json({
    status: 'success',
    data: roiValue,
  });
});

module.exports = {
  createRoiValue,
  updateRoiValue,
  getRoiValue,
  updateRoiValueHistory,
};
