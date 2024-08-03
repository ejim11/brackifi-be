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
const { activateInvestment } = require('../controllers/admin/adminController');
const { protectAdmin } = require('../controllers/admin/adminAuth');
const { protectAll, restrictTo } = require('../controllers/handleFactory');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protectAll, getAllInvestments)
  .post(protect, setInvestorId, createInvestment);

router.route('/activate-investment').patch(protectAdmin, activateInvestment);

router
  .route('/:id')
  .get(getInvestment)
  .delete(protectAll, restrictTo('admin'), deleteInvestment)
  .patch(makeWithdrawalRequest);

router
  .route('/:investmentId/make-withdrawal')
  .patch(protect, makeWithdrawalRequest);

module.exports = router;
