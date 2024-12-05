const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceTitle: {
    type: String,
    required: true,
  },
  customTitle: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'rescheduled'],
    default: 'pending',
  },
});

const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;