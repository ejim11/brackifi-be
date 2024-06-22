const express = require('express');
const {
  addSubscriber,
  getAllSubscribers,
  removeSubscriber,
  unsubscribe,
} = require('../controllers/admin/subscriberController');

const router = express.Router();

router.route('/').get(getAllSubscribers).post(addSubscriber);
router.route('/unsubscribe').get(unsubscribe);

router.route('/:id').post(removeSubscriber);

module.exports = router;
