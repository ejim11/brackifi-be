const ManagerCommentary = require('../../models/managerCommentaryModel');
const {
  createOne,
  getAllDocs,
  getOne,
  deleteOne,
} = require('../handleFactory');

// create a report
const createManagerCommentary = createOne(ManagerCommentary);

// get all reports
const getAllManagerCommentarys = getAllDocs(ManagerCommentary);

// get a report
const getManagerCommentary = getOne(ManagerCommentary);

// delete a report
const deleteManagerCommentary = deleteOne(ManagerCommentary);

module.exports = {
  createManagerCommentary,
  getAllManagerCommentarys,
  deleteManagerCommentary,
  getManagerCommentary,
};
