const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  orderType: {
    type: String,
    required: [true, 'Please provide a valid order type'],
    enum: ['buy', 'sell'],
  },
  walletAddress: {
    type: String,
    required: [true, 'Please provide wallet address'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
