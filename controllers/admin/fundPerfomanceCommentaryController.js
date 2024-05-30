const FundPerformanceCommentary = require('../../models/fundPerfomanceCommentaryModel');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

// create a report
const createFundPerformanceCommentary = createOne(FundPerformanceCommentary);

// get all reports
const getAllFundPerformanceCommentaries = getAllDocs(FundPerformanceCommentary);

// get a report
const getFundPerformanceCommentary = getOne(FundPerformanceCommentary);

// delete a report
const deleteFundPerformanceCommentary = deleteOne(FundPerformanceCommentary);

module.exports = {
  createFundPerformanceCommentary,
  getAllFundPerformanceCommentaries,
  deleteFundPerformanceCommentary,
  getFundPerformanceCommentary,
};
