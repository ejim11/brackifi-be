const { PotentialShareholder } = require('../models/potentialShareholderModel');
const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
  const filteredBody = filterObj(req.body, 'name', 'email');

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

const createPotentialShareholder = catchAsync(async (req, res, next) => {
  const potentialShareHolder = await PotentialShareholder.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    proofOfIdentity: req.body.proofOfIdentity,
    proofOfAddress: req.body.proofOfAddress,
    nextOfKin: {
      name: req.body.nextOfKinName,
      email: req.body.nextOfKinEmail,
      address: req.body.nextOfKinAddress,
    },
  });
  res.status(201).json({
    status: 'success',
    data: {
      potentialShareHolder,
    },
  });
});

const getAllPotentialShareHolders = catchAsync(async (req, res, next) => {
  const allPotentialShareholders =
    await PotentialShareholder.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: allPotentialShareholders.length,
    data: {
      allPotentialShareholders,
    },
  });
});

const getAllShareholders = catchAsync(async (req, res, next) => {
  const allShareholders = await Shareholder.find().select('-__v');

  res.status(200).json({
    statusbar: 'success',
    results: allShareholders.length,
    data: {
      allShareholders,
    },
  });
});

module.exports = {
  getAllPotentialShareHolders,
  createPotentialShareholder,
  getAllShareholders,
  updateMe,
};
