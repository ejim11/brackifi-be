const { PotentialInvestor } = require('../models/PotentialInvestorsModel');
const Investor = require('../models/investorModel');
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
  const updatedInvestor = await Investor.findByIdAndUpdate(
    req.investor.id,
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
      investor: updatedInvestor,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await Investor.findByIdAndUpdate(req.investor.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const createPotentialInvestor = catchAsync(async (req, res, next) => {
  const potentialInvestor = await PotentialInvestor.create({
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
      potentialInvestor,
    },
  });
});

const getAllPotentialInvestors = catchAsync(async (req, res, next) => {
  const allPotentialInvestors = await PotentialInvestor.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: allPotentialInvestors.length,
    data: {
      allPotentialInvestors,
    },
  });
});

const getAllInvestors = catchAsync(async (req, res, next) => {
  const allInvestors = await Investor.find().select('-__v');

  res.status(200).json({
    statusbar: 'success',
    results: allInvestors.length,
    data: {
      allInvestors,
    },
  });
});

module.exports = {
  getAllPotentialInvestors,
  createPotentialInvestor,
  getAllInvestors,
  updateMe,
  deleteMe,
};
