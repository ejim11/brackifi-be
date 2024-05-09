const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { APIFeatures } = require('../utils/apiFeatures');

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

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
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

const getAllDocs = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested get reviews on tour
    // let filteredObj = {};
    // if (req.params.tourId) filteredObj = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find({}), req.query)
      .sort()
      .limitFields()
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
        data: docs,
      },
    });
  });

module.exports = { deleteOne, updateOne, createOne, getOne, getAllDocs };
