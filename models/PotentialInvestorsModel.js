/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');

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

const potentialInvestorSchema = new mongoose.Schema({
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
});

const PotentialInvestor = mongoose.model(
  'potentialInvestor',
  potentialInvestorSchema,
);

module.exports = { PotentialInvestor };
