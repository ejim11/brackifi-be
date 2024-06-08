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
const { validateOrder } = require('../controllers/admin/adminController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllOrders)
  .post(protect, setShareholderId, createOrder);

router.route('/validate-order').patch(validateOrder);

router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;
