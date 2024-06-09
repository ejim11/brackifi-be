const express = require('express');
const {
  createPotentialInvestor,
  getAllPotentialInvestors,
  updateMe,
  deleteMe,
  getAllInvestors,
  getAnInvestor,
  deleteAnInvestor,
} = require('../controllers/investors/investorController');
const {
  createInvestor,
  signInInvestor,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/investors/investorAuthController');
const investmentRouter = require('./investmentRoute');
const {
  uploadAuthImages,
  resizeAuthImages,
} = require('../controllers/shareholders/shareholderAuthController');
const { activateInvestor } = require('../controllers/admin/adminController');

const router = express.Router();

router.use('/:investorId/investments', investmentRouter);

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

router
  .route('/')
  .get(protect, getAllInvestors)
  .post(uploadAuthImages, resizeAuthImages, createInvestor);

router.route('/:id').get(protect, getAnInvestor).delete(deleteAnInvestor);

router.route('/activate-investor').patch(activateInvestor);

module.exports = router;
