/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

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

const signInShareholder = catchAsync(async (req, res, next) => {
  //   check if email and password already exist
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }

  // check if the user exists and password is correct

  const shareholder = await Shareholder.findOne({ email }).select('+password');

  if (
    !shareholder ||
    !(await shareholder.correctPassword(password, shareholder.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if everything is ok, send the token to the client

  const token = signToken(shareholder._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      shareholder,
    },
  });
});

module.exports = {
  createShareholder,
  signInShareholder,
};
