const mongoose = require('mongoose');

const featuredPostSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: [true, 'A research must have a image'],
  },
  link: {
    type: String,
    required: [true, 'A research must have a link'],
  },
});

const FeaturedPost = mongoose.model('FeaturedPost', featuredPostSchema);

module.exports = FeaturedPost;
