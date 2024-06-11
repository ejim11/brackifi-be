/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email address'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
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
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    image: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

adminSchema.pre(/^find/, async function (next) {
  // (this) points to the current query

  this.find({ active: { $ne: false } });
  next();
});

adminSchema.pre('save', async function (next) {
  // run func if password was modified
  if (!this.isModified('password')) return next();

  //   hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

adminSchema.methods.createPasswordResetToken = function () {
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

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
