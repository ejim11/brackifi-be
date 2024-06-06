const express = require('express');
const {
  createRoiValue,
  updateRoiValue,
  getRoiValue,
  updateRoiValueHistory,
} = require('../controllers/admin/roiValueController');
// const { protect } = require('../controllers/investors/investorAuthController');

const router = express.Router();

router.route('/').post(createRoiValue);

router.route('/updatevaluehistory/:id').put(updateRoiValueHistory);

router.route('/:id').get(getRoiValue).patch(updateRoiValue);

module.exports = router;
