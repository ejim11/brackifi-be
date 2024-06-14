/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const Admin = require('../../models/adminModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
// const sendEmail = require('../../utils/email');
const Email = require('../../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  admin.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin,
    },
  });
};

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

const uploadAdminAuthImage = upload.single('image');

const resizeAdminAuthImage = catchAsync(async (req, res, next) => {
  if (!req.file) next();

  req.file.filename = `img-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(`public/img/admin/${req.file.filename}`);

  next();
});

const createAdmin = catchAsync(async (req, res, next) => {
  const newAdmin = await Admin.create(req.body);

  new Email(newAdmin, '').sendWelcomeShareholder();

  createSendToken(newAdmin, 201, res);
});

const signInAdmin = catchAsync(async (req, res, next) => {
  //   check if email and password already exist
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }

  // check if the user exists and password is correct

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // if everything is ok, send the token to the client

  createSendToken(admin, 200, res);
});

// middleware to protect tours route
const protectAdmin = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 401- unauthorized
  if (!token) {
    return next(
      new AppError(`You are not logged in! Please login to get access.`, 401),
    );
  }
  // 2) validate (verify) the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
    () => {},
  );

  // console.log(decoded);

  // 3) check if the user still exists
  const currentUser = await Admin.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(`The user belonging to this token no longer exists`, 401),
    );
  }

  // 4) check if user changed password after the JWT (token) was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password! Please login again`, 401),
    );
  }

  // Grant access to protected route
  req.admin = currentUser;
  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on posted email
  const user = await Admin.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`There is no user with the email`, 404));
  }

  // 2 generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const hostLink =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/auth/reset-password'
      : process.env.SHAREHOLDER_PROD_RESET_PASSWORD_PATH;

  const resetURL = `${hostLink}/${resetToken}`;

  try {
    new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again',
        500,
      ),
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  // 2 if the token has not expired and there is a user, set the password

  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  // 3 update changePasswordAt property for the admin
  // This is updated on every save

  // 4 login the admin in, send JWT
  createSendToken(admin, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, newPassword, confirmNewPassword } = req.body;

  // 1 get the user from the collection
  const admin = await Admin.findById(req.admin.id).select('+password');

  // 2 check if the posted password is correct
  if (
    !admin &&
    !(await admin.correctPassword(passwordCurrent, admin.password))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3 if the password is correct, update the password
  admin.password = newPassword;
  admin.passwordConfirm = confirmNewPassword;
  await admin.save();

  // 4 login admin and send JWt
  createSendToken(admin, 200, res);
});

module.exports = {
  createAdmin,
  signInAdmin,
  protectAdmin,
  forgotPassword,
  resetPassword,
  updatePassword,
  uploadAdminAuthImage,
  resizeAdminAuthImage,
};
