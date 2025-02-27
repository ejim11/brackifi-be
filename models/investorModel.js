/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name is required'],
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    ubitexId: {
      type: String,
      required: false,
    },
    isLoginActivated: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email address'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, 'Please provide a phone number'],
      validate: {
        validator: (val) =>
          /(?:\+?(\d{1,3}))?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(
            val,
          ),
        message: 'Please provide a valid phone number',
      },
    },
    proofOfIdentity: {
      type: String,
      required: [true, 'Please provide a proof of identity'],
    },
    proofOfAddress: {
      type: String,
      required: [true, 'Please provide a proof of address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please provide a password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    createdAt: { type: Date, default: Date.now() },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    image: String,
    role: {
      type: String,
      default: 'investor',
      enum: ['investor'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual populate
// This virtually populates the investor with their investments
investorSchema.virtual('investments', {
  ref: 'Investment',
  foreignField: 'investor',
  localField: '_id',
});

investorSchema.pre(/^find/, function (next) {
  // (this) points to the current query

  // this finds all the investors with active set to true
  this.find({ active: { $ne: false } });
  next();
});

investorSchema.pre('save', async function (next) {
  // run next func(skip) if password was not modified
  if (!this.isModified('password')) return next();

  //   hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

investorSchema.pre('save', async function (next) {
  // if password was not modified and it is a new password then skip
  if (!this.isModified('password') || this.isNew) return next();

  // set the time the password was updated if it was modified
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// checking if the passwords match when investor login
investorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// checking when the investor changes the password
investorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }
  // false means password not changed.
  return false;
};

investorSchema.methods.createPasswordResetToken = function () {
  // creating the reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // hashing the reset token and storing it in the DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Investor = mongoose.model('Investor', investorSchema);

module.exports = Investor;
