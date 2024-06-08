const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const DocsAndReports = require('../../models/documentAndReportsModel');
const {
  // createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

// keeping the image in memory so we can use it again
const multerStorage = multer.memoryStorage();

// function for filtering what kind of files it should store
const multerFilter = (req, file, cb) => cb(null, true);

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadReportDocFiles = upload.fields([
  { name: 'docImage', maxCount: 1 },
  { name: 'docFile', maxCount: 1 },
]);

const resizeReportImage = catchAsync(async (req, res, next) => {
  if (!req.files.docImage) {
    return next(new AppError(' please provide doc image', 400));
  }

  const imgFileName = `img-doc-${Date.now()}`;

  req.body.docImage = `img/report/img/${imgFileName}.jpeg`;

  await sharp(req.files.docImage[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/report/img/${imgFileName}.jpeg`);

  next();
});

// create a report
const createDocAndReport = catchAsync(async (req, res, next) => {
  if (!req.files.docFile[0]) {
    return res.status(400).send('No file uploaded.');
  }

  // Get the file buffer and the original file name
  const { originalname } = req.files.docFile[0];

  // Define the path where you want to save the file
  const filePath = path.join(
    __dirname,
    '/../../public/img/report/file',
    originalname,
  );

  // Write the file to the file system
  fs.writeFile(filePath, req.files.docFile[0].buffer, async (err) => {
    if (err) {
      console.log(err);
      return next(new AppError('Error saving file', 500));
    }
    req.body.docFile = `img/report/file/${originalname}`;

    const newReport = await DocsAndReports.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newReport,
      },
    });
  });
});

// get all reports
const getAllReports = getAllDocs(DocsAndReports);

// get a report
const getReport = getOne(DocsAndReports);

// delete a report
const deleteReport = deleteOne(DocsAndReports);

module.exports = {
  createDocAndReport,
  getAllReports,
  deleteReport,
  getReport,
  uploadReportDocFiles,
  resizeReportImage,
};
