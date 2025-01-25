const Investment = require('../../models/investmentModel');
const {
  getAllDocs,
  getOne,
  //   updateOne,
  deleteOne,
} = require('../handleFactory');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Investor = require('../../models/investorModel');
const Email = require('../../utils/email');
const formatAmount = require('../../utils/formatAmount');

const setInvestorId = (req, res, next) => {
  if (!req.body.investor) req.body.investor = req.investor.id;
  next();
};

// // create an investment
const createInvestment = catchAsync(async (req, res, next) => {
  const doc = await Investment.create(req.body);

  const investor = await Investor.findById(req.body.investor);

  await new Email(
    investor,
    '',
    process.env.EMAIL_FROM,
    formatAmount(doc.amount),
    new Date().toDateString(),
  ).sendDepositEmail();

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

// get all Investment
const getAllInvestments = getAllDocs(Investment);

// get a particular investment
const getInvestment = getOne(Investment);

// update an investment
// const updateInvestment = updateOne(Investment);

// Delete an investment
const deleteInvestment = deleteOne(Investment);

const makeWithdrawalRequest = catchAsync(async (req, res, next) => {
  // Create error if user posts password data
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400,
      ),
    );
  }

  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

  // Update user document
  // filter the fields to what you want to change
  const filteredBody = filterObj(req.body, 'investmentState');

  // updated the user
  const updatedInvestment = await Investment.findByIdAndUpdate(
    req.body.investmentId,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  // return updated user
  res.status(200).json({
    status: 'success',
    data: {
      investment: updatedInvestment,
    },
  });
});

module.exports = {
  createInvestment,
  setInvestorId,
  getAllInvestments,
  getInvestment,
  //   updateInvestment,
  deleteInvestment,
  makeWithdrawalRequest,
};
