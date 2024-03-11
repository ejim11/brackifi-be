const express = require('express');
const {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
} = require('../controllers/subscriberController');

const router = express.Router();

router.route('/').get(getAllSubscribers).post(addSubscriber);

router.route('/:id').post(removeSubscriber);

module.exports = router;
