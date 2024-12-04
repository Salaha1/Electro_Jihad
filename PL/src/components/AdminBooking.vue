<template>
  <div class="admin-booking-manager">
    <h3>Booking Manager</h3>
    <div v-for="booking in bookings" :key="booking.id" class="booking">
      <p><strong>User:</strong> {{ booking.user.email }}</p>
      <p><strong>Service:</strong> {{ booking.serviceTitle || booking.customTitle }}</p>
      <p><strong>Date:</strong> {{ booking.date }}</p>
      <p><strong>Status:</strong> {{ booking.status }}</p>

      <button @click="updateBooking(booking.id, 'confirmed')">Confirm</button>
      <button @click="rescheduleBooking(booking.id)">Reschedule</button>
      <button @click="updateBooking(booking.id, 'canceled')">Cancel</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
    };
  },
  created() {
    this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      const response = await axios.get('/api/bookings?status=pending');
      this.bookings = response.data;
    },
    async updateBooking(bookingId, status) {
      await axios.put(`/api/bookings/${bookingId}`, { status });
      this.fetchBookings();
    },
    rescheduleBooking(bookingId) {
      // Logic to open a date picker and update booking.
      const newDate = prompt('Enter new date (YYYY-MM-DD):');
      if (newDate) {
        axios.put(`/api/bookings/${bookingId}`, { date: newDate }).then(this.fetchBookings);
      }
    },
  },
};
</script>

<style>
.admin-booking-manager {
  padding: 20px;
}

.booking {
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>