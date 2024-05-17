const express = require('express');
const {
  createPotentialShareholder,
  getAllPotentialShareHolders,
  getAllShareholders,
  updateMe,
  deleteMe,
  getShareholder,
} = require('../controllers/shareholderController');
const {
  createShareholder,
  signInShareholder,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/shareholderAuthController');
const ordersRouter = require('./ordersRoute');

const router = express.Router();

router.use('/:shareholderId/orders', ordersRouter);

router.route('/login').post(signInShareholder);

router.route('/forgotPassword').post(forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router
  .route('/potential-shareholders')
  .get(protect, getAllPotentialShareHolders)
  .post(createPotentialShareholder);

router.route('/').get(protect, getAllShareholders).post(createShareholder);

router.route('/:id').get(getShareholder);

module.exports = router;
