const express = require('express');
const {
  getFundPerformanceCommentary,
  getAllFundPerformanceCommentaries,
  deleteFundPerformanceCommentary,
  createFundPerformanceCommentary,
} = require('../controllers/admin/fundPerfomanceCommentaryController');

const router = express.Router();

router
  .route('/')
  .get(getAllFundPerformanceCommentaries)
  .post(createFundPerformanceCommentary);

router
  .route('/:id')
  .get(getFundPerformanceCommentary)
  .delete(deleteFundPerformanceCommentary);

module.exports = router;
