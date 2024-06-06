const express = require('express');
const {
  createInvestment,
  setInvestorId,
  getAllInvestments,
  getInvestment,
  deleteInvestment,
  makeWithdrawalRequest,
} = require('../controllers/investors/investmentController');
const { protect } = require('../controllers/investors/investorAuthController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllInvestments)
  .post(protect, setInvestorId, createInvestment);

router
  .route('/:id')
  .get(getInvestment)
  .delete(deleteInvestment)
  .patch(makeWithdrawalRequest);

router
  .route('/:investmentId/make-withdrawal')
  .patch(protect, makeWithdrawalRequest);

module.exports = router;
