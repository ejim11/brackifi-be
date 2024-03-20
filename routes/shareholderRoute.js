const express = require('express');
const {
  createPotentialShareholder,
  getAllPotentialShareHolders,
  getAllShareholders,
} = require('../controllers/shareholderController');
const { createShareholder } = require('../controllers/authController');

const router = express.Router();

router
  .route('/potential-shareholders')
  .get(getAllPotentialShareHolders)
  .post(createPotentialShareholder);

router.route('/').get(getAllShareholders).post(createShareholder);

module.exports = router;
