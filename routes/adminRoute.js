const express = require('express');

const {
  createAdmin,
  signInAdmin,
  protectAdmin,
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
router.patch('/updateMyPassword', protectAdmin, updatePassword);

router.route('/').post(uploadAdminAuthImage, resizeAdminAuthImage, createAdmin);

module.exports = router;
