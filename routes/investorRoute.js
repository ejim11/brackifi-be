const express = require('express');
const {
  createPotentialInvestor,
  getAllPotentialInvestors,
  updateMe,
  deleteMe,
  getAllInvestors,
} = require('../controllers/investorController');
const {
  createInvestor,
  signInInvestor,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/investorAuthController');

const router = express.Router();

router.route('/login').post(signInInvestor);

router.route('/forgotPassword').post(forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router
  .route('/potential-investors')
  .get(protect, getAllPotentialInvestors)
  .post(createPotentialInvestor);

router.route('/').get(protect, getAllInvestors).post(createInvestor);

module.exports = router;
