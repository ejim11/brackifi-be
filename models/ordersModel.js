const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema(
  {
    orderType: {
      type: String,
      required: [true, 'Please provide a valid order type'],
      enum: ['buy', 'sell'],
    },
    walletAddress: {
      type: String,
      required: [true, 'Please provide wallet address'],
      maxLength: ['42', 'The address must be equal to 42 characters'],
      minLength: ['42', 'The address must be equal to 42 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    shareCost: {
      type: Number,
      required: [true, 'Please provide a share cost'],
    },
    orderStatus: {
      type: String,
      enum: ['verifying', 'verified', 'failed'],
      required: [true, 'Please provide an order status'],
      default: 'verifying',
    },
    shareholder: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shareholder',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ordersSchema.pre(/^find/, async function (next) {
  this.populate({ path: 'shareholder', select: 'name' });
  next();
});

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
