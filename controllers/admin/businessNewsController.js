const multer = require('multer');
const sharp = require('sharp');
const BusinessNews = require('../../models/businessNewsModel');
const { getAllDocs, getOne, deleteOne } = require('../handleFactory');
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

const uploadBusinessNewsPhoto = upload.single('image');

const resizeBusinessNewsPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `img-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/img/business-news/${req.file.filename}`);

  next();
});

// resources to handle
// create a business news post
const createBusinessNews = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = `img/business-news/${req.file.filename}`;
  const doc = await BusinessNews.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

// const createBusinessNews = createOne(BusinessNews);

// get all reports
const getAllBusinessNews = getAllDocs(BusinessNews);

// get a report
const getBusinessNews = getOne(BusinessNews);

// delete a report
const deleteBusinessNews = deleteOne(BusinessNews);

module.exports = {
  createBusinessNews,
  getAllBusinessNews,
  deleteBusinessNews,
  getBusinessNews,
  uploadBusinessNewsPhoto,
  resizeBusinessNewsPhoto,
};
