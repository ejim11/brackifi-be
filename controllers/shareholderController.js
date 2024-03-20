const { PotentialShareholder } = require('../models/potentialShareholderModel');
const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');

const createPotentialShareholder = catchAsync(async (req, res, next) => {
  const potentialShareHolder = await PotentialShareholder.create({
    name: req.body.name,
    title: req.body.title,
    email: req.body.email,
    mailingAddress: req.body.mailingAddress,
    state: req.body.state,
    city: req.body.city,
    zipCode: req.body.zipCode,
    country: req.body.country,
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
};
