const express = require('express');
const router = express.Router();
const Bookings = require('../../DAL/models/Bookings'); // Consistent name
const Services = require('../../DAL/models/Services');
const { isAuthenticated, isAdmin } = require('../../BLL/services/middleware/authMiddleware');
const { getUserByEmail } = require('../../DAL/models/Customers');

// Fetch available services (no authentication required)
router.get('/book', async (req, res) => {
  try {
    const services = await Services.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Fetch all bookings (Admin only)
router.get('/bookings', isAdmin, async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  try {
    const bookings = await Bookings.find(query); // Use "Bookings" consistently
    for (const booking of bookings) {
      const user = await getUserByEmail(booking.email);
      booking.user = user;
    }
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Create a booking
router.post('/booking', isAuthenticated, async (req, res) => {
  const { serviceTitle, customTitle, date, timeSlot } = req.body;
  const email = req.user.email;

  try {
    if (!timeSlot) {
      return res.status(400).json({ message: 'Time slot is required.' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check for an existing booking in the same time slot
    const existingBooking = await Bookings.findOne({ date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    // Handle custom service input
    let service = null;
    if (serviceTitle === null && customTitle) {
      // Check if the custom service already exists
      service = await Services.findOne({ title: customTitle });

      if (!service) {
        // Create a new service entry for the custom service
        service = new Services({ title: customTitle });
        await service.save();
      }
    } else {
      // Find the selected service from the database
      service = await Services.findOne({ title: serviceTitle });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Create a new booking
    const booking = new Bookings({
      user: user.customer_id,
      serviceTitle: service.title,
      customTitle: customTitle || null,
      date: date.split('T')[0], // Format date to 'YYYY-MM-DD'
      timeSlot,
      email,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully.' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});
router.get('/bookings/unavailable', async (req, res) => {
  try {
    const bookings = await Bookings.find({});
    const unavailableDates = [];
    const unavailableTimeSlots = {};

    bookings.forEach((booking) => {
      const { date, timeSlot } = booking;
      if (!unavailableTimeSlots[date]) unavailableTimeSlots[date] = [];
      unavailableTimeSlots[date].push(timeSlot);

      // Mark date as fully booked if all slots are taken
      if (unavailableTimeSlots[date].length === 8) {
        unavailableDates.push(date);
      }
    });

    res.json({ dates: unavailableDates, timeSlots: unavailableTimeSlots });
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    res.status(500).json({ message: 'Failed to fetch unavailable dates.' });
  }
});
module.exports = router;