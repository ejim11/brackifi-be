/* eslint-disable node/no-extraneous-require */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Shareholder = require('../../models/shareholderModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
// const sendEmail = require('../../utils/email');
const Email = require('../../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });

const createSendToken = (shareholder, statusCode, res) => {
  const token = signToken(shareholder._id);

  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   ),
  //   // this ensures xss attacks can not access the cookie
  //   httpOnly: true,
  // };

  // // secure as true means it has to be https
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // res.cookie('jwt', token, cookieOptions);

  shareholder.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      shareholder,
    },
  });
};

// keeping the image in memory so we can use it again
const multerStorage = multer.memoryStorage();

// function for filtering what kind of files it should store
const multerFilter = (req, file, cb) => {
  cb(null, true);
  // if (file.mimetype.startsWith('image')) {
  //   cb(null, true);
  // } else {
  //   cb(new AppError('Not an image, please upload only images', 400), false);
  // }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadAuthImages = upload.fields([
  { name: 'proofOfIdentity', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
]);

const resizeAuthImages = catchAsync(async (req, res, next) => {
  if (!req.files.proofOfAddress || !req.files.proofOfAddress) {
    return next(new AppError('please provide auth images', 400));
  }

  const isIdentityImg = req.files.proofOfIdentity[0].mimetype.includes('image');

  const isAddressImg = req.files.proofOfAddress[0].mimetype.includes('image');

  req.body.proofOfIdentity = isIdentityImg
    ? `img-identity-${Date.now()}.jpeg`
    : req.files.proofOfIdentity[0].originalname;
  req.body.proofOfAddress = isAddressImg
    ? `img-address-${Date.now()}.jpeg`
    : req.files.proofOfAddress[0].originalname;

  if (isIdentityImg) {
    await sharp(req.files.proofOfIdentity[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/auth/shareholders/${req.body.proofOfIdentity}`);
  } else {
    // Define the path where you want to save the file
    const filePath = path.join(
      __dirname,
      '/../../public/img/auth/shareholders',
      req.body.proofOfIdentity,
    );

    // write the file into the file system
    fs.writeFile(filePath, req.files.proofOfIdentity[0].buffer, async (err) => {
      if (err) {
        console.log(err);
        return next(new AppError('Error saving file', 500));
      }
    });
  }

  if (isAddressImg) {
    await sharp(req.files.proofOfAddress[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/auth/shareholders/${req.body.proofOfAddress}`);
  } else {
    const filesPath = path.join(
      __dirname,
      '/../../public/img/auth/shareholders',
      req.body.proofOfAddress,
    );

    // write the file into the file system
    fs.writeFile(filesPath, req.files.proofOfAddress[0].buffer, async (err) => {
      if (err) {
        console.log(err);
        return next(new AppError('Error saving file', 500));
      }
    });
  }
  next();
});

const createShareholder = catchAsync(async (req, res, next) => {
  const newShareholder = await Shareholder.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    proofOfIdentity: req.body.proofOfIdentity,
    proofOfAddress: req.body.proofOfAddress,
    nextOfKin: {
      name: req.body.nextOfKinName,
      email: req.body.nextOfKinEmail,
      address: req.body.nextOfKinAddress,
    },
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await new Email(
    newShareholder,
    '',
    process.env.EMAIL_TEAM,
  ).sendWelcomeShareholder();

  createSendToken(newShareholder, 201, res);
});

const signInShareholder = catchAsync(async (req, res, next) => {
  //   check if email and password already exist
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }

  // check if the user exists and password is correct

  const shareholder = await Shareholder.findOne({ email })
    .select('+password')
    .populate({ path: 'orders' });

  if (
    !shareholder ||
    !(await shareholder.correctPassword(password, shareholder.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!shareholder.isLoginActivated) {
    return next(new AppError('Please wait till your is activated', 401));
  }

  // if everything is ok, send the token to the client

  createSendToken(shareholder, 200, res);
});

// middleware to protect tours route
const protect = catchAsync(async (req, res, next) => {
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
  const currentUser = await Shareholder.findById(decoded.id);

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
  req.shareholder = currentUser;
  next();
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1 get user based on posted email
  const user = await Shareholder.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`There is no user with the email`, 404));
  }

  // 2 generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3 send it to the users email
  // const resetURL = `${req.protocol}://${req.get(
  //   'host',
  // )}/api/v1/users/reserPassword/${resetToken}`;

  // const resetURL = `http://localhost:3000/auth/reset-password/${resetToken}`;

  const hostLink =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/auth/reset-password'
      : process.env.SHAREHOLDER_PROD_RESET_PASSWORD_PATH;

  const resetURL = `${hostLink}/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \nIf you didn't forget your password, please ignore this email.`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10min)',
    //   message,
    // });

    await new Email(
      user,
      resetURL,
      process.env.EMAIL_SUPPORT,
    ).sendPasswordReset();
    // const cookieOptions = {
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    //   ),
    //   // this ensures xss attacks can not access the cookie
    //   httpOnly: true,
    // };

    // // secure as true means it has to https
    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // res.cookie('resetToken', resetToken, cookieOptions);

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

  const shareholder = await Shareholder.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 if the token has not expired and there is a user, set the password
  if (!shareholder) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  shareholder.password = req.body.password;
  shareholder.passwordConfirm = req.body.passwordConfirm;
  shareholder.passwordResetToken = undefined;
  shareholder.passwordResetExpires = undefined;
  await shareholder.save();

  // 3 update changePasswordAt property for the shareholder
  // This is updated on every save

  // 4 login the shareholder in, send JWT
  createSendToken(shareholder, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, newPassword, confirmNewPassword } = req.body;

  // 1 get the user from the collection
  const shareholder = await Shareholder.findById(req.shareholder.id).select(
    '+password',
  );

  // 2 check if the posted password is correct
  if (
    !shareholder &&
    !(await shareholder.correctPassword(passwordCurrent, shareholder.password))
  ) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3 if the password is correct, update the password
  shareholder.password = newPassword;
  shareholder.passwordConfirm = confirmNewPassword;
  await shareholder.save();

  // 4 login shareholder and send JWt
  createSendToken(shareholder, 200, res);
});

module.exports = {
  createShareholder,
  signInShareholder,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  uploadAuthImages,
  resizeAuthImages,
};
