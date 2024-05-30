const InvestmentPosition = require('../../models/investmentPositionModel');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

// create a report
const createInvestmentPosition = createOne(InvestmentPosition);

// get all reports
const getAllInvestmentPositions = getAllDocs(InvestmentPosition);

// get a report
const getInvestmentPosition = getOne(InvestmentPosition);

// delete a report
const deleteInvestmentPosition = deleteOne(InvestmentPosition);

module.exports = {
  createInvestmentPosition,
  getAllInvestmentPositions,
  deleteInvestmentPosition,
  getInvestmentPosition,
};
