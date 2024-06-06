const express = require('express');
const {
  createFeaturedPost,
  getAllFeaturedPosts,
  deleteFeaturedPost,
  uploadFeaturedPostPhoto,
  resizeFeaturedPostPhoto,
} = require('../controllers/admin/featuredPostController');

const router = express.Router();

router
  .route('/')
  .get(getAllFeaturedPosts)
  .post(uploadFeaturedPostPhoto, resizeFeaturedPostPhoto, createFeaturedPost);

router.route('/:id').delete(deleteFeaturedPost);

module.exports = router;
