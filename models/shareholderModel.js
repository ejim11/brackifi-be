/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const shareholderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide your valid email address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  mailingAddress: {
    type: String,
    required: [true, 'Please provide a mailing address'],
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
  },
  state: {
    type: String,
    required: [true, 'Please provide a state'],
  },
  zipCode: {
    type: String,
    required: [true, 'Please provide a zip code'],
  },
  country: {
    type: String,
    required: [true, 'Please provide a country'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password.'],
    minLength: 8,
    select: false,
  },
  photo: String,
});

shareholderSchema.pre('save', async function (next) {
  // run func if password was modified
  if (!this.isModified('password')) return next();

  //   hashing the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
});

const Shareholder = mongoose.model('Shareholder', shareholderSchema);

module.exports = Shareholder;
