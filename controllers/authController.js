/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Shareholder = require('../models/shareholderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createShareholder = catchAsync(async (req, res, next) => {
  const newShareholder = await Shareholder.create({
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
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
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

// middleware to protect tours route
const protect = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 401- unauthorized
  if (!token) {
    return next(
      new AppError(`You are not logged in! Please login to get access.`, 401),
    );
  }
  // 2) validate (verify) the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
    () => {},
  );

  // console.log(decoded);

  // 3) check if the user still exists
  const currentUser = await Shareholder.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(`The user belonging to this token no longer exists`, 401),
    );
  }

  // 4) check if user changed password after the JWT (token) was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password! Please login again`, 401),
    );
  }

  // Grant access to protected route
  req.shareholder = currentUser;
  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on posted email
  const user = await Shareholder.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`There is no user with the email`, 404));
  }

  // 2 generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3 send it to the users email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/reserPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again',
        500,
      ),
    );
  }
});

module.exports = {
  createShareholder,
  signInShareholder,
  protect,
  forgotPassword,
};
