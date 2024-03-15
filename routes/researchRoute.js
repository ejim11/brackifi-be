const express = require('express');
const {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
} = require('../controllers/researchController');

const router = express.Router();

router.route('/').get(getAllResearchPosts).post(createResearchPost);

router.route('/:id').delete(deleteResearchPost);

module.exports = router;
