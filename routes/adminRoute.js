const express = require('express');

const {
  createAdmin,
  signInAdmin,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  uploadAdminAuthImage,
  resizeAdminAuthImage,
} = require('../controllers/admin/adminAuth');

const router = express.Router();

router.route('/login').post(signInAdmin);

router.route('/forgotPassword').post(forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

router.route('/').post(uploadAdminAuthImage, resizeAdminAuthImage, createAdmin);

module.exports = router;
