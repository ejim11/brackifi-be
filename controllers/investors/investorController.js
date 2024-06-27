const multer = require('multer');
const sharp = require('sharp');
const { PotentialInvestor } = require('../../models/PotentialInvestorsModel');
const Investor = require('../../models/investorModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

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

const uploadProfilePhoto = upload.single('image');

const resizeProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `img-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`/files/investors/${req.file.filename}`);

  next();
});

const updateProfileImage = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = `/files/investors/${req.file.filename}`;

  const updatedInvestor = await Investor.findByIdAndUpdate(
    req.investor.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      image: updatedInvestor.image,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  // Create error if user posts password data
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400,
      ),
    );
  }

  // Update user document
  // filter the fields to what you want to change
  const filteredBody = filterObj(
    req.body,
    'name',
    'email',
    'address',
    'phoneNumber',
    'nextOfKinName',
    'nextOfKinEmail',
    'nextOfKinAddress',
  );

  // updated the user
  const updatedInvestor = await Investor.findByIdAndUpdate(
    req.investor.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  // console.log(updatedUser);

  // return updated user
  res.status(200).json({
    status: 'success',
    data: {
      investor: updatedInvestor,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await Investor.findByIdAndUpdate(req.investor.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const createPotentialInvestor = createOne(PotentialInvestor);

const getAllPotentialInvestors = getAllDocs(PotentialInvestor);

const getAllInvestors = getAllDocs(Investor, {
  path: 'investments',
  select: '-investor',
});

const getAnInvestor = getOne(Investor, {
  path: 'investments',
  select: '-investor',
});

const deleteAnInvestor = deleteOne(Investor);

module.exports = {
  getAllPotentialInvestors,
  createPotentialInvestor,
  getAllInvestors,
  updateMe,
  deleteMe,
  getAnInvestor,
  deleteAnInvestor,
  uploadProfilePhoto,
  updateProfileImage,
  resizeProfilePhoto,
};
