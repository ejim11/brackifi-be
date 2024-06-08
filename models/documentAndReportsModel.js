const mongoose = require('mongoose');

const docsAndReportsSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please provide a title.'] },
  summary: { type: String, required: [true, 'Please provide a summary'] },
  date: { type: Date, default: Date.now() },
  docImage: { type: String, required: [true, 'Please provide an image'] },
  docFile: { type: String, required: [true, 'Please provide a file'] },
});

const DocsAndReports = mongoose.model('DocsAndReports', docsAndReportsSchema);

module.exports = DocsAndReports;
