const Research = require('../../models/researchModel');
const { createOne, getAllDocs, deleteOne } = require('../handleFactory');

// resources to handle
// create a research post
const createResearchPost = createOne(Research);

// get all research posts
const getAllResearchPosts = getAllDocs(Research);

// delete a research post
const deleteResearchPost = deleteOne(Research);

module.exports = {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
};
