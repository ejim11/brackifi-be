const express = require('express');
const {
  createPotentialShareholder,
  getAllPotentialShareHolders,
  getAllShareholders,
  updateMe,
  deleteMe,
  getShareholder,
  uploadProfilePhoto,
  resizeProfilePhoto,
  updateProfileImage,
} = require('../controllers/shareholders/shareholderController');
const {
  createShareholder,
  signInShareholder,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  uploadAuthImages,
  resizeAuthImages,
} = require('../controllers/shareholders/shareholderAuthController');
const ordersRouter = require('./ordersRoute');
const { activateUser } = require('../controllers/admin/adminController');
const { protectAdmin } = require('../controllers/admin/adminAuth');

const router = express.Router();

router.use('/:shareholderId/orders', ordersRouter);

router.route('/login').post(signInShareholder);

router.route('/forgotPassword').post(forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router
  .route('/update-profile-img')
  .patch(protect, uploadProfilePhoto, resizeProfilePhoto, updateProfileImage);

router
  .route('/potential-shareholders')
  .get(protect, getAllPotentialShareHolders)
  .post(createPotentialShareholder);

router
  .route('/')
  .get(protectAdmin, getAllShareholders)
  .post(uploadAuthImages, resizeAuthImages, createShareholder);

router.route('/:id').get(getShareholder);

router.route('/activate-shareholder').patch(activateUser);

module.exports = router;
