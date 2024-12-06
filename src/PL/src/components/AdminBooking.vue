<template>
  <div class="admin-booking-manager">
    <h3>Booking Manager</h3>
    <div v-for="booking in bookings" :key="booking.id" class="booking">
      <p><strong>User:</strong> {{ booking.user.email }}</p>
      <p><strong>Service:</strong> {{ booking.serviceTitle || booking.customTitle }}</p>
      <p><strong>Date:</strong> {{ booking.date }}</p>
      <p><strong>Status:</strong> {{ booking.status }}</p>

      <button @click="updateBooking(booking.id, 'confirmed')">Confirm</button>
      <button @click="openRescheduleModal(booking)">Reschedule</button>
      <button @click="updateBooking(booking.id, 'canceled')">Cancel</button>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showModal" class="modal">
      <h4>Reschedule Booking</h4>
      <input v-model="rescheduleDate" type="date" />
      <button @click="rescheduleBooking">Submit</button>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
      showModal: false,
      selectedBooking: null,
      rescheduleDate: '',
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
    openRescheduleModal(booking) {
      this.selectedBooking = booking;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.rescheduleDate = '';
    },
    async rescheduleBooking() {
      if (!this.rescheduleDate) {
        alert('Please select a new date.');
        return;
      }

      await axios.put(`/api/bookings/${this.selectedBooking.id}`, {
        status: 'rescheduled',
        rescheduleDate: this.rescheduleDate,
      });
      this.closeModal();
      this.fetchBookings();
    },
  },
};
</script>