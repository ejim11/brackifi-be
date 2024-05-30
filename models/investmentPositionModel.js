const mongoose = require('mongoose');

const investmentPositionSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: [true, 'Please provide an asset name'],
  },
  position: {
    type: String,
    enum: ['Long', 'Short'],
    required: [true, 'Please provide a valid investment positon'],
  },
  returns: {
    type: Number,
    required: [true, 'Please provide a valid return on investment'],
    min: [0, 'Roi must be above or equal to 1'],
    max: [100, 'Roi must be below or equal to 100'],
    set: (value) => Math.round(value * 10) / 10,
  },
});

const InvestmentPosition = mongoose.model(
  'InvestmentPosition',
  investmentPositionSchema,
);

module.exports = InvestmentPosition;
