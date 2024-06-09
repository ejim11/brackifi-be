const mongoose = require('mongoose');

const businessNewsSchema = new mongoose.Schema({
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
    default: Date.now(),
  },
  author: {
    type: String,
    required: [true, 'A research must have a author'],
  },
  image: {
    type: String,
    required: [true, 'A research must have a image'],
  },
  link: {
    type: String,
    required: [true, 'A research must have a link'],
  },
});

const BusinessNews = mongoose.model('BusinessNews', businessNewsSchema);

module.exports = BusinessNews;
