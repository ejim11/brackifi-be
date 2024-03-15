const Research = require('../models/researchModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// resources to handle
// create a research post
const createResearchPost = catchAsync(async (req, res, next) => {
  const researchPost = await Research.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      researchPost,
    },
  });
});

// get all research posts
const getAllResearchPosts = catchAsync(async (req, res, next) => {
  const allResearchPosts = await Research.find();

  res.status(200).json({
    status: 'success',
    results: allResearchPosts.length,
    data: {
      allResearchPosts,
    },
  });
});

// delete a research post
const deleteResearchPost = catchAsync(async (req, res, next) => {
  const deletedResearchPost = await Research.findByIdAndDelete(req.params.id);

  if (!deletedResearchPost) {
    return next(new AppError('Could not find research post', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
};
