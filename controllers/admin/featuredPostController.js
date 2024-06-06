/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const FeaturedPost = require('../../models/featuredPostModel');
const { getAllDocs, deleteOne } = require('../handleFactory');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// keeping the image in memory so we can use it again
const multerStorage = multer.memoryStorage();

// function for filtering what kind of files it should store
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadFeaturedPostPhoto = upload.single('image');

const resizeFeaturedPostPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `img-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/img/featured-posts/${req.file.filename}`);

  next();
});

// resources to handle
// create a featured post
const createFeaturedPost = catchAsync(async (req, res, next) => {
  if (req.file)
    req.body.image = `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_HOST : process.env.WEB_HOST}/img/featured-posts/${req.file.filename}`;
  const doc = await FeaturedPost.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

// get all research posts
const getAllFeaturedPosts = getAllDocs(FeaturedPost);

// delete a research post
const deleteFeaturedPost = deleteOne(FeaturedPost);

module.exports = {
  createFeaturedPost,
  getAllFeaturedPosts,
  deleteFeaturedPost,
  uploadFeaturedPostPhoto,
  resizeFeaturedPostPhoto,
};
