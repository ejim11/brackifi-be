const express = require('express');
const {
  getBusinessNews,
  getAllBusinessNews,
  deleteBusinessNews,
  createBusinessNews,
  uploadBusinessNewsPhoto,
  resizeBusinessNewsPhoto,
} = require('../controllers/admin/businessNewsController');

const router = express.Router();

router
  .route('/')
  .get(getAllBusinessNews)
  .post(uploadBusinessNewsPhoto, resizeBusinessNewsPhoto, createBusinessNews);

router.route('/:id').get(getBusinessNews).delete(deleteBusinessNews);

module.exports = router;
