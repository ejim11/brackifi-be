const { PotentialShareholder } = require('../models/potentialShareholderModel');
const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { createOne, getAllDocs } = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
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
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'address',
    'phoneNumber',
    'nextOfKinName',
    'nextOfKinEmail',
    'nextOfKinAddress',
  );

  // updated the user
  const updatedUser = await Shareholder.findByIdAndUpdate(
    req.shareholder.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  // console.log(updatedUser);

  // return updated user
  res.status(200).json({
    status: 'success',
    data: {
      shareholder: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await Shareholder.findByIdAndUpdate(req.shareholder.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const createPotentialShareholder = createOne(PotentialShareholder);

const getAllPotentialShareHolders = getAllDocs(PotentialShareholder);

const getAllShareholders = getAllDocs(Shareholder);

module.exports = {
  getAllPotentialShareHolders,
  createPotentialShareholder,
  getAllShareholders,
  updateMe,
  deleteMe,
};
