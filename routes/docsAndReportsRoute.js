const express = require('express');
const {
  getReport,
  getAllReports,
  deleteReport,
  createDocAndReport,
  uploadReportDocFiles,
  resizeReportImage,
} = require('../controllers/admin/documentsAndReportsController');

const router = express.Router();

router
  .route('/')
  .get(getAllReports)
  .post(uploadReportDocFiles, resizeReportImage, createDocAndReport);

router.route('/:id').get(getReport).delete(deleteReport);

module.exports = router;
