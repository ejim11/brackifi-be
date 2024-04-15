const catchAsync = require('../utils/catchAsync');
const DocsAndReports = require('../models/documentAndReportsModel');
const AppError = require('../utils/appError');

// create a report
const createDocAndReport = catchAsync(async (req, res, next) => {
  const report = await DocsAndReports.create({
    title: req.body.title,
    summary: req.body.summary,
    date: req.body.date,
    image: req.body.image,
  });

  res.status(200).json({
    status: 'success',
    data: {
      report,
    },
  });
});

// get all reports
const getAllReports = catchAsync(async (req, res, next) => {
  const allReports = await DocsAndReports.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: allReports.length,
    data: {
      allReports,
    },
  });
});

// get a report
const getReport = catchAsync(async (req, res, next) => {
  const report = await DocsAndReports.findById(req.params.id);

  if (!report) {
    return next(AppError('Could not find report', 404));
  }

  res.status(200).json({
    status: ' success',
    data: report,
  });
});

// delete a report
const deleteReport = catchAsync(async (req, res, next) => {
  const deletedResearchPost = await DocsAndReports.findByIdAndDelete(
    req.params.id,
  );

  if (!deletedResearchPost) {
    return next(new AppError('Could not find report', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = { createDocAndReport, getAllReports, deleteReport, getReport };
