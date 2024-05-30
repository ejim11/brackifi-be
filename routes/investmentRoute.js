const express = require('express');
const {
  createInvestment,
  setInvestorId,
  getAllInvestments,
  getInvestment,
  deleteInvestment,
} = require('../controllers/investors/investmentController');
const { protect } = require('../controllers/investors/investorAuthController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllInvestments)
  .post(protect, setInvestorId, createInvestment);

router.route('/:id').get(getInvestment).delete(deleteInvestment);

module.exports = router;
