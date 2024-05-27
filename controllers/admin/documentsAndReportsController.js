const DocsAndReports = require('../../models/documentAndReportsModel');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

// create a report
const createDocAndReport = createOne(DocsAndReports);

// get all reports
const getAllReports = getAllDocs(DocsAndReports);

// get a report
const getReport = getOne(DocsAndReports);

// delete a report
const deleteReport = deleteOne(DocsAndReports);

module.exports = { createDocAndReport, getAllReports, deleteReport, getReport };
