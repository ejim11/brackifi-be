const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Please provide your wallet address'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount for investment'],
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  nextPayout: {
    type: Date,
    default: () => {
      const today = new Date();

      // Add 4 months to today's date
      const futureDate = new Date();
      futureDate.setMonth(today.getMonth() + 4);
      return futureDate;
    },
  },
  roi: {
    type: Number,
    default: 0,
    min: [0, 'Roi must be above or equal to 1'],
    max: [100, 'Roi must be below or equal to 100'],
    set: (value) => Math.round(value * 10) / 10,
  },
  maximumDrawdown: {
    type: Number,
    required: [true, 'Please provide an amount for maximum drawdown'],
    min: [0, 'Roi must be above or equal to 1'],
    max: [100, 'Roi must be below or equal to 100'],
    set: (value) => Math.round(value * 10) / 10,
  },
  investmentState: {
    type: String,
    default: 'inactive',
    enum: [
      'inactive',
      'active',
      'up for withdrawal',
      'withdraw pending',
      'withdrawn',
    ],
  },
  activeDate: {
    type: Date,
  },
  payoutAvailable: {
    type: Number,
    default: 0,
  },
  contractPeriod: {
    type: Date,
    required: [true, 'Please select a contract period'],
  },
  investor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investor',
  },
});

investmentSchema.pre(/^find/, async function (next) {
  this.populate({ path: 'investor', select: 'name' });
  next();
});

investmentSchema.pre(/^find/, async function (next) {
  this.populate({ path: 'investor', select: 'name' });
  next();
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
