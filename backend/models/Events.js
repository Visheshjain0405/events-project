const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date },
  description: { type: String }
});

module.exports = mongoose.model('Event', eventSchema);