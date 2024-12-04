const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: Number, required: true }, // MySQL user ID
  serviceTitle: { type: String, required: true },
  customTitle: { type: String },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Bookings', bookingSchema);