const express = require('express');
const {
  createShareValue,
  updateShareValue,
  getShareValue,
} = require('../controllers/shareValueController');

const router = express.Router();

router.route('/').post(createShareValue);

router.route('/:id').get(getShareValue).patch(updateShareValue);

module.exports = router;
