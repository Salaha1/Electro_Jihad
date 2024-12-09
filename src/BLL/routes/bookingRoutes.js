const express = require('express');
const router = express.Router();
const { fetchBookings,
  fetchBookingById,
  fetchDateBookings,
  fetchAllBookings,
  addBooking,
  updateBooking,
  deleteBooking} = require('../../DAL/models/Bookings'); // Consistent name
const Services = require('../../DAL/models/Services');
const { isAuthenticated, isAdmin } = require('../../BLL/services/middleware/authMiddleware');
const { getUserByEmail, getUserById } = require('../../DAL/models/Customers');
const moment = require('moment');
const {sendSMS} = require('../services/bookingService');
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
// to fetch pending bookings for admin page
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const status = req.query.status || 'pending'; // Default to 'pending' if no status is provided
    const bookings = await fetchBookings(status); // Fetch bookings based on status

    // Loop through the bookings and fetch user details by customer_id
    for (const booking of bookings) {
      const user = await getUserById(booking.customer_id); // Fetch user by customer_id
      booking.user = user; // Add user details to the booking object
    }

    res.json(bookings); // Send the bookings data as a response
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});
// admin confirm book
// Confirm booking and send SMS
router.put('/bookings/:id/confirm', isAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await fetchBookingById(bookingId); // Fetch the booking to get user ID and phone number

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const result = await updateBooking(bookingId, { status: 'confirmed' });

    if (result > 0) {
      // Send SMS notification to the user
      await sendSMS(booking.user_id, 'Your booking has been confirmed.');

      res.json({ message: 'Booking confirmed.' });
    } else {
      res.status(500).json({ message: 'Failed to confirm booking.' });
    }
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ message: 'Failed to confirm booking.' });
  }
});

// Cancel booking and send SMS
router.put('/bookings/:id/reschedule', isAdmin, async (req, res) => {
  const { rescheduleDate } = req.body;

  if (!rescheduleDate) {
    return res.status(400).json({ message: 'New date is required.' });
  }

  try {
    const bookingId = req.params.id;
    const existingBooking = await fetchBookings('pending'); // Check for conflicts with other pending bookings

    // Check if the new date and time slot are already booked
    const bookingExists = existingBooking.some((booking) => booking.date === rescheduleDate);

    if (bookingExists) {
      return res.status(400).json({ message: 'This new date is already booked.' });
    }

    const booking = await fetchBookingById(bookingId); // Fetch the booking to get user ID and phone number
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const result = await updateBooking(bookingId, {
      status: 'rescheduled',
      date: rescheduleDate,
    });

    if (result > 0) {
      // Send SMS notification to the user
      await sendSMS(booking.user_id, `Your booking has been rescheduled to ${rescheduleDate}.`);

      res.json({ message: 'Booking rescheduled.' });
    } else {
      res.status(500).json({ message: 'Failed to reschedule booking.' });
    }
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ message: 'Failed to reschedule booking.' });
  }
});
router.put('/bookings/:id/cancel', isAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await fetchBookingById(bookingId); // Fetch the booking to get user ID and phone number

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const result = await deleteBooking(bookingId); // Remove the booking from the database

    if (result > 0) {
      // Send SMS notification to the user
      await sendSMS(booking.user_id, 'Your booking has been canceled.');

      res.json({ message: 'Booking canceled.' });
    } else {
      res.status(500).json({ message: 'Failed to cancel booking.' });
    }
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ message: 'Failed to cancel booking.' });
  }
});

// Create a booking for normal users
// Create a booking
router.post('/booking', isAuthenticated, async (req, res) => {
  const { serviceTitle, customTitle, date, timeSlot } = req.body;
  const email = req.user.email;

  try {
    // Check if date and timeSlot are provided in the request body
    if (!date || !timeSlot) {
      return res.status(400).json({ message: 'Date and time slot are required.' });
    }

    // Fetch the user from the database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check for conflicting bookings on the same date and time slot
    const conflictingBookings = await fetchDateBookings({ date, timeSlot });
    console.log(conflictingBookings);
    if (conflictingBookings.length > 0) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    // Handle custom service input or selected service
    let service = null;
    if (serviceTitle === null && customTitle) {
      // Check if the custom service already exists
      service = await Services.findOne({ title: customTitle });

      if (!service) {
        // Create a new service entry for the custom service
        service = new Services({ title: customTitle });
        await service.save();
      }
    } else if (serviceTitle) {
      // Find the selected service from the database
      service = await Services.findOne({ title: serviceTitle });
    }

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    // Create a new booking object
    const booking = {
      customer_id: user.customer_id,
      service_title: service.title,
      custom_title: customTitle || null,
      date: date.split('T')[0], // Format date to 'YYYY-MM-DD'
      time_slot: timeSlot,
      email,
      status: 'pending',
    };

    // Add the booking to the database
    const bookingId = await addBooking(booking);

    // Return the success response with the booking ID
    res.status(201).json({ message: 'Booking created successfully.', bookingId });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});
router.get('/bookings/unavailable', async (req, res) => {
  try {
    const bookings = await fetchAllBookings();

    if (!bookings || bookings.length === 0) {
      return res.json({ dates: [], timeSlots: {} });
    }

    const unavailableDates = [];
    const unavailableTimeSlots = {};

    bookings.forEach((booking) => {
      let { date, timeSlot } = booking;

      // Normalize the date to a specific format (e.g., "YYYY-MM-DD")
      date = moment(date).format('YYYY-MM-DD');

      if (!unavailableTimeSlots[date]) {
        unavailableTimeSlots[date] = [];
      }

      // Add the time slot to the list for the given date
      if (!unavailableTimeSlots[date].includes(timeSlot)) {
        unavailableTimeSlots[date].push(timeSlot);
      }
    });

    // Determine fully booked dates
    Object.keys(unavailableTimeSlots).forEach((date) => {
      if (unavailableTimeSlots[date].length === 8) { // Adjust based on your time slot availability
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