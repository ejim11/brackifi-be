const express = require('express');
const {
  getFundPerformanceCommentary,
  getAllFundPerformanceCommentaries,
  deleteFundPerformanceCommentary,
  createFundPerformanceCommentary,
  uploadFundCommentaryDocFiles,
  resizeFundCommentaryImage,
} = require('../controllers/admin/fundPerfomanceCommentaryController');

const router = express.Router();

router
  .route('/')
  .get(getAllFundPerformanceCommentaries)
  .post(
    uploadFundCommentaryDocFiles,
    resizeFundCommentaryImage,
    createFundPerformanceCommentary,
  );

router
  .route('/:id')
  .get(getFundPerformanceCommentary)
  .delete(deleteFundPerformanceCommentary);

module.exports = router;
