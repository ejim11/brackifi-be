const express = require('express');
const {
  getManagerCommentary,
  getAllManagerCommentarys,
  deleteManagerCommentary,
  createManagerCommentary,
} = require('../controllers/admin/managerCommentaryController');

const router = express.Router();

router.route('/').get(getAllManagerCommentarys).post(createManagerCommentary);

router.route('/:id').get(getManagerCommentary).delete(deleteManagerCommentary);

module.exports = router;
