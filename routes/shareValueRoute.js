const express = require('express');
const {
  createShareValue,
  updateShareValue,
  getShareValue,
  updateShareValueHistory,
} = require('../controllers/admin/shareValueController');

const router = express.Router();

router.route('/').post(createShareValue);

router.route('/updatevaluehistory/:id').put(updateShareValueHistory);

router.route('/:id').get(getShareValue).patch(updateShareValue);

module.exports = router;
