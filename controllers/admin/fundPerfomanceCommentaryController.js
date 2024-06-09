const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const FundPerformanceCommentary = require('../../models/fundPerfomanceCommentaryModel');
const { getAllDocs, getOne, deleteOne } = require('../handleFactory');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// keeping the image in memory so we can use it again
const multerStorage = multer.memoryStorage();

// function for filtering what kind of files it should store
const multerFilter = (req, file, cb) => cb(null, true);

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadFundCommentaryDocFiles = upload.fields([
  { name: 'docImage', maxCount: 1 },
  { name: 'docFile', maxCount: 1 },
]);

const resizeFundCommentaryImage = catchAsync(async (req, res, next) => {
  if (!req.files.docImage) {
    return next(new AppError(' please provide doc image', 400));
  }

  const imgFileName = `img-doc-${Date.now()}`;

  req.body.docImage = `img/fundCommentary/img/${imgFileName}.jpeg`;

  await sharp(req.files.docImage[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/fundCommentary/img/${imgFileName}.jpeg`);

  next();
});

//create a fund commentary
const createFundPerformanceCommentary = catchAsync(async (req, res, next) => {
  if (!req.files.docFile[0]) {
    return res.status(400).send('No file uploaded.');
  }

  // Get the file buffer and the original file name
  const { originalname } = req.files.docFile[0];

  // Define the path where you want to save the file
  const filePath = path.join(
    __dirname,
    '/../../public/img/fundCommentary/file',
    originalname,
  );

  // Write the file to the file system
  fs.writeFile(filePath, req.files.docFile[0].buffer, async (err) => {
    if (err) {
      console.log(err);
      return next(new AppError('Error saving file', 500));
    }
    req.body.docFile = `img/fundCommentary/file/${originalname}`;

    const newFundCommentary = await FundPerformanceCommentary.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc: newFundCommentary,
      },
    });
  });
});

// create a report
// const createFundPerformanceCommentary = createOne(FundPerformanceCommentary);

// get all reports
const getAllFundPerformanceCommentaries = getAllDocs(FundPerformanceCommentary);

// get a report
const getFundPerformanceCommentary = getOne(FundPerformanceCommentary);

// delete a report
const deleteFundPerformanceCommentary = deleteOne(FundPerformanceCommentary);

module.exports = {
  createFundPerformanceCommentary,
  getAllFundPerformanceCommentaries,
  deleteFundPerformanceCommentary,
  getFundPerformanceCommentary,
  uploadFundCommentaryDocFiles,
  resizeFundCommentaryImage,
};
