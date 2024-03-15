const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A research must have a title'],
    unique: true,
  },
  summary: {
    type: String,
    required: [true, 'A research must have a summary'],
  },
  datePosted: {
    type: Date,
    required: [true, 'A research must have a date'],
  },
  author: {
    type: String,
    required: [true, 'A research must have a author'],
  },
  image: {
    type: String,
    required: [true, 'A research must have a image'],
  },
});

const Research = mongoose.model('Research', researchSchema);

module.exports = Research;
