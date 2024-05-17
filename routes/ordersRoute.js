const express = require('express');
const {
  createOrder,
  setShareholderId,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect } = require('../controllers/shareholderAuthController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllOrders)
  .post(protect, setShareholderId, createOrder);

router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;
