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
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(signInShareholder);

router.route('/forgotPassword').post(forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router
  .route('/potential-shareholders')
  .get(protect, getAllPotentialShareHolders)
  .post(createPotentialShareholder);

router.route('/').get(protect, getAllShareholders).post(createShareholder);

module.exports = router;
