const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;