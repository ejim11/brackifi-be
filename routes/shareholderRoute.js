const express = require('express');
const {
  createPotentialShareholder,
  getAllPotentialShareHolders,
  getAllShareholders,
} = require('../controllers/shareholderController');
const {
  createShareholder,
  signInShareholder,
  protect,
} = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(signInShareholder);

router
  .route('/potential-shareholders')
  .get(protect, getAllPotentialShareHolders)
  .post(createPotentialShareholder);

router.route('/').get(protect, getAllShareholders).post(createShareholder);

module.exports = router;
