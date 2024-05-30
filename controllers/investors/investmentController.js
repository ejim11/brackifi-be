const Investment = require('../../models/investmentModel');
const {
  createOne,
  getAllDocs,
  getOne,
  //   updateOne,
  deleteOne,
} = require('../handleFactory');

const setInvestorId = (req, res, next) => {
  if (!req.body.investor) req.body.investor = req.investor.id;
  next();
};

// // create an investment
const createInvestment = createOne(Investment);

// get all Investment
const getAllInvestments = getAllDocs(Investment);

// get a particular investment
const getInvestment = getOne(Investment);

// update an investment
// const updateInvestment = updateOne(Investment);

// Delete an investment
const deleteInvestment = deleteOne(Investment);

module.exports = {
  createInvestment,
  setInvestorId,
  getAllInvestments,
  getInvestment,
  //   updateInvestment,
  deleteInvestment,
};
