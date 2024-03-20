const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');

const createShareholder = catchAsync(async (req, res, next) => {
  const newShareholder = await Shareholder.create({
    title: req.body.title,
    name: req.body.name,
    email: req.body.email,
    mailingAddress: req.body.mailingAddress,
    zipCode: req.body.zipCode,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    password: req.body.password,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newShareholder,
    },
  });
});

module.exports = {
  createShareholder,
};
