/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const Research = require('../../models/researchModel');
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

const uploadResearchPhoto = upload.single('image');

const resizeResearchPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `img-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/img/researches/${req.file.filename}`);

  next();
});

// resources to handle
// create a research post
const createResearchPost = catchAsync(async (req, res, next) => {
  if (req.file)
    req.body.image = `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_HOST : process.env.WEB_HOST}/img/researches/${req.file.filename}`;
  const doc = await Research.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

// get all research posts
const getAllResearchPosts = getAllDocs(Research);

// delete a research post
const deleteResearchPost = deleteOne(Research);

module.exports = {
  createResearchPost,
  getAllResearchPosts,
  deleteResearchPost,
  uploadResearchPhoto,
  resizeResearchPhoto,
};
