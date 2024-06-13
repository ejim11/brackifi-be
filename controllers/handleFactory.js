/* eslint-disable no-nested-ternary */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { APIFeatures } = require('../utils/apiFeatures');
const Admin = require('../models/adminModel');
const Investor = require('../models/investorModel');
const Shareholder = require('../models/shareholderModel');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No Doc found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const activateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.body.id,
      { isLoginActivated: true },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!doc) {
      return next(new AppError('No user found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

const getAllDocs = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested get reviews on tour
    let filteredObj = {};
    let fields = '';
    if (req.params.shareholderId)
      filteredObj = { shareholder: req.params.shareholderId };

    if (req.params.investorId) {
      filteredObj = { investor: req.params.investorId };
      fields = '-investor';
    }

    let query = Model.find(filteredObj);

    if (popOptions) {
      query = Model.find(filteredObj).populate(popOptions);
    }

    const features = new APIFeatures(query, req.query)
      .sort()
      .limitFields(fields)
      .paginate()
      .filter();
    // .sort()
    // .limitFields()
    // .paginate();

    // explain
    // const docs = await features.query.explain();

    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: docs.length,
      data: {
        docs,
      },
    });
  });

const protectAll = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.slice().split(' ')[1];
    console.log(token);
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

  const idParam = req.headers.authorization.slice().split(' ')[2];

  // console.log(decoded);
  const Model =
    idParam === 'admin'
      ? Admin
      : idParam === 'investor'
        ? Investor
        : Shareholder;

  // 3) check if the user still exists
  const currentUser = await Model.findById(decoded.id);

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
  req[idParam] = currentUser;
  req.user = currentUser;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403),
      );
    }
    next();
  };

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAllDocs,
  activateOne,
  restrictTo,
  protectAll,
};
