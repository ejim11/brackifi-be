const express = require('express');
const {
  getReport,
  getAllReports,
  deleteReport,
  createDocAndReport,
} = require('../controllers/documentsAndReportsController');

const router = express.Router();

router.route('/').get(getAllReports).post(createDocAndReport);

router.route('/:id').get(getReport).delete(deleteReport);

module.exports = router;
