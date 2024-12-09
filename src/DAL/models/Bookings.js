const db = require('../MySQL Connection/config'); // Import the db from config.js
const moment = require('moment');
// Fetch bookings by status
async function fetchBookings(status = 'pending') {
  try {
    const query = 'SELECT * FROM bookings WHERE status = ?';
    const [rows] = await db.execute(query, [status]); // Using parameterized query to avoid SQL injection
    console.log('Query executed:', query);
    return rows; 
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}
async function fetchAllBookings() {
  try {
    const query = 'SELECT * FROM bookings';
    const [rows] = await db.execute(query); // Using parameterized query to avoid SQL injection

    // Normalize the date format and structure the time slots
    return rows.map((row) => ({
      ...row,
      date: moment(row.date).format('YYYY-MM-DD'), // Normalize the date format
      timeSlot: row.time_slot, // Correctly map the time slot
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}
async function fetchDateBookings({ date, timeSlot }) {
  const query = `SELECT * FROM bookings WHERE date = ? AND time_slot = ?`;
  const [results] = await db.execute(query, [date, timeSlot]);
  return results;
}
// Fetch a booking by its ID
async function fetchBookingById(bookingId) {
  try {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows] = await db.execute(query, [bookingId]);
    return rows[0]; // Return the first result
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
}
async function addBooking(booking) {
  try {
    const query = `
      INSERT INTO bookings (customer_id, service_title, custom_title, date, time_slot, email, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const { customer_id, service_title, custom_title, date, time_slot, email, status } = booking;
    const [result] = await db.execute(query, [
      customer_id,
      service_title,
      custom_title || null,
      date,
      time_slot,
      email,
      status || 'pending',
    ]);
    return result.insertId;
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
}

// Update an existing booking
async function updateBooking(id, updates) {
  try {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);

    const query = `UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await db.execute(query, values);
    return result.affectedRows; // Returns the number of affected rows
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}
// Function to delete booking from database
async function deleteBooking(bookingId) {
  try {
    const query = 'DELETE FROM bookings WHERE id = ?';
    const [result] = await db.execute(query, [bookingId]);
    return result.affectedRows; // Returns the number of affected rows
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}
module.exports = {
  fetchBookings,
  fetchBookingById,
  fetchDateBookings,
  fetchAllBookings,
  addBooking,
  updateBooking,
  deleteBooking
};