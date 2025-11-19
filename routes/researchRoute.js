const express = require('express');
const {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
  uploadResearchPhoto,
  resizeResearchPhoto,
  getInfo,
} = require('../controllers/admin/researchController');

const router = express.Router();

router
  .route('/')
  .get(getAllResearchPosts)
  .post(uploadResearchPhoto, resizeResearchPhoto, createResearchPost);

router.route('/get-info').post(getInfo);

router.route('/:id').delete(deleteResearchPost);

module.exports = router;
