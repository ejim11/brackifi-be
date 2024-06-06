const express = require('express');
const {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
  uploadResearchPhoto,
  resizeResearchPhoto,
} = require('../controllers/admin/researchController');

const router = express.Router();

router
  .route('/')
  .get(getAllResearchPosts)
  .post(uploadResearchPhoto, resizeResearchPhoto, createResearchPost);

router.route('/:id').delete(deleteResearchPost);

module.exports = router;
