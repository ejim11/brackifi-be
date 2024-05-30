const express = require('express');
const {
  getInvestmentPosition,
  deleteInvestmentPosition,
  createInvestmentPosition,
  getAllInvestmentPositions,
} = require('../controllers/admin/investmentPositionController');

const router = express.Router();

router.route('/').get(getAllInvestmentPositions).post(createInvestmentPosition);

router
  .route('/:id')
  .get(getInvestmentPosition)
  .delete(deleteInvestmentPosition);

module.exports = router;
