const express = require('express');
const {
  getBusinessNews,
  getAllBusinessNews,
  deleteBusinessNews,
  createBusinessNews,
} = require('../controllers/admin/businessNewsController');

const router = express.Router();

router.route('/').get(getAllBusinessNews).post(createBusinessNews);

router.route('/:id').get(getBusinessNews).delete(deleteBusinessNews);

module.exports = router;
