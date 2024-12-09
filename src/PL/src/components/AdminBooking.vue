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
      <input v-model="rescheduleDate" type="date" min="2024-01-01" :max="maxDate" required />
      <button @click="rescheduleBooking" :disabled="!rescheduleDate">Submit</button>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>
Updated script:
javascript
Copy code
<script>
import axios from 'axios';

export default {
  data() {
    return {
      bookings: [],
      showModal: false,
      selectedBooking: null,
      rescheduleDate: '',
      maxDate: '',  // To handle maximum reschedule date (optional)
    };
  },
  created() {
    this.fetchBookings();
    this.setMaxDate();
  },
  methods: {
    // Fetch bookings by status
    async fetchBookings() {
      try {
        const response = await axios.get('/api/bookings', {
          params: {
            status: 'pending', // Pass 'pending' as a query parameter
          },
        });
        console.log(response.data); // Log the fetched bookings
        this.bookings = response.data; // Set the bookings data
      } catch (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
    },
    // Update booking status (confirm, cancel, reschedule)
    async updateBooking(bookingId, action) {
      try {
        let endpoint = '';
        if (action === 'confirmed') {
          endpoint = `/api/bookings/${bookingId}/confirm`;
        } else if (action === 'canceled') {
          endpoint = `/api/bookings/${bookingId}/cancel`;
        } else if (action === 'rescheduled') {
          endpoint = `/api/bookings/${bookingId}/reschedule`;
        }

        await axios.put(endpoint, { date: this.rescheduleDate });
        this.fetchBookings();  // Refresh bookings after update
        this.closeModal();
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking.');
      }
    },

    // Open reschedule modal
    openRescheduleModal(booking) {
      this.selectedBooking = booking;
      this.showModal = true;
      this.rescheduleDate = this.selectedBooking.date; // Pre-fill with current booking date
    },

    // Close the modal
    closeModal() {
      this.showModal = false;
      this.rescheduleDate = '';  // Reset the reschedule date
    },

    // Reschedule booking
    async rescheduleBooking() {
      if (!this.rescheduleDate || new Date(this.rescheduleDate) < new Date()) {
        alert('Please choose a valid future date.');
        return;
      }

      try {
        const bookingId = this.selectedBooking.id;
        await this.updateBooking(bookingId, 'rescheduled');  // Trigger booking update with new date
      } catch (error) {
        console.error('Error rescheduling booking:', error);
        alert('Failed to reschedule booking.');
      }
    },

    // Set max date for rescheduling (optional)
    setMaxDate() {
      const today = new Date();
      const maxDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      this.maxDate = maxDate;
    }
  },
};
</script>