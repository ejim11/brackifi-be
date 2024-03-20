const express = require('express');
const {
  createPotentialShareholder,
  getAllPotentialShareHolders,
} = require('../controllers/shareholderController');

const router = express.Router();

router
  .route('/potential-shareholders')
  .get(getAllPotentialShareHolders)
  .post(createPotentialShareholder);

module.exports = router;
