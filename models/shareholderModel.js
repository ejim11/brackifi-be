/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const nextOfKinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a next of kin name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide next of kin email address'],
    lowercase: true,
    validate: [
      validator.isEmail,
      'Please provide a valid email address for next of kin',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please provide next of kin address'],
  },
});

const shareholderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
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
        /(?:\+?(\d{1,3}))?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(val),
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
  nextOfKin: {
    type: nextOfKinSchema,
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  shareValue: {
    type: Number,
    default: 0,
  },
  shareROI: {
    type: Number,
    default: 0,
    min: [0, 'share roi must be above or equal to 0'],
    max: [100, 'share roi must be below or equal to 100'],
    set: (value) => Math.round(value * 10) / 10,
  },
  shareData: [
    {
      dateCreated: { type: Date, Default: Date.now() },
      shareCost: Number,
      sharesBought: Number,
    },
  ],
  image: String,
});

shareholderSchema.pre(/^find/, function (next) {
  // (this) points to the current query

  this.find({ active: { $ne: false } });
  next();
});

shareholderSchema.pre('save', async function (next) {
  // run func if password was modified
  if (!this.isModified('password')) return next();

  //   hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

shareholderSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

shareholderSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

shareholderSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

shareholderSchema.methods.createPasswordResetToken = function () {
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

const Shareholder = mongoose.model('Shareholder', shareholderSchema);

module.exports = Shareholder;
