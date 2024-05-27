const express = require('express');
const {
  createOrder,
  setShareholderId,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/admin/orderController');
const {
  protect,
} = require('../controllers/shareholders/shareholderAuthController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllOrders)
  .post(protect, setShareholderId, createOrder);

router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;
