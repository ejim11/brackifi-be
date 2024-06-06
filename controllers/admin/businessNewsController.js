const BusinessNews = require('../../models/businessNewsModel');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

// create a report
const createBusinessNews = createOne(BusinessNews);

// get all reports
const getAllBusinessNews = getAllDocs(BusinessNews);

// get a report
const getBusinessNews = getOne(BusinessNews);

// delete a report
const deleteBusinessNews = deleteOne(BusinessNews);

module.exports = {
  createBusinessNews,
  getAllBusinessNews,
  deleteBusinessNews,
  getBusinessNews,
};
