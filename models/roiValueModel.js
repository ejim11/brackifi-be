const mongoose = require('mongoose');

const roiValueHistorySchema = new mongoose.Schema({
  value: {
    type: Number,
    default: 0,
    required: [true, 'A value is required'],
  },
  month: {
    type: Date,
    default: Date.now(),
    required: [true, 'A month is required'],
    // set: (value) => new Date(value).toLocale(),
  },
});

const roiValueSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, 'A value is required'],
    },
    performanceCommentary: {
      type: String,
      required: [true, 'A fund performance commentary is required'],
    },
    history: {
      type: [roiValueHistorySchema],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// roiValueSchema.pre(/^find/, function () {
//   console.log(this);
//   //   this.history = this.history.map((item) => ({
//   //     value: item.value,
//   //     month: new Date(item.month),
//   //   }));
// });

const RoiValue = mongoose.model('RoiValue', roiValueSchema);

module.exports = RoiValue;
