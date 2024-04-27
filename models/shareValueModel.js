const mongoose = require('mongoose');

const shareValueHistorySchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0,
    required: [true, 'A value is required'],
  },
  month: {
    type: Date,
    default: Date.now(),
    required: [true, 'A month is required'],
  },
});

const shareValueSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },
  history: {
    type: [shareValueHistorySchema],
  },
});

const shareValueModel = mongoose.model('ShareValue', shareValueSchema);

module.exports = shareValueModel;
