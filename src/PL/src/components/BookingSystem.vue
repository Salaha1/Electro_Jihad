<template>
  <div class="booking-system">
    <h3 class="title">Book a Service</h3>
    <div class="form">
      <!-- Service Selection -->
      <div class="form-group">
        <label for="serviceSelect">Choose a Service:</label>
        <select id="serviceSelect" v-model="selectedService" class="form-control">
          <option v-for="service in services" :key="service.id" :value="service.title">
            {{ service.title }}
          </option>
          <option value="custom">Other (Specify Below)</option>
        </select>
      </div>
      <div v-if="selectedService === 'custom'" class="form-group">
        <input
          v-model="customService"
          class="form-control"
          placeholder="Enter custom service"
        />
      </div>

      <!-- Date Picker -->
      <div class="form-group">
        <label for="datepicker">Select a Date:</label>
        <input
          id="datepicker"
          type="text"
          ref="datepicker"
          readonly
          class="form-control calendar-input"
          placeholder="Select a date"
        />
        <small v-if="errors.date" class="error-message">{{ errors.date }}</small>
      </div>

      <!-- Time Slot Selection -->
      <div class="form-group">
        <label for="timeSlotSelect">Choose a Time Slot:</label>
        <select id="timeSlotSelect" v-model="selectedTimeSlot" class="form-control">
          <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
            {{ slot }}
          </option>
          <option v-if="availableTimeSlots.length === 0" disabled>No available time slots</option>
        </select>
        <small v-if="errors.timeSlot" class="error-message">{{ errors.timeSlot }}</small>
      </div>

      <!-- Booking Button -->
      <div class="form-group">
        <button @click="bookService" class="btn btn-primary">Book Now</button>
        <small v-if="errors.general" class="error-message">{{ errors.general }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Pikaday from 'pikaday';

export default {
  data() {
    return {
      services: [], // List of available services
      selectedService: null,
      customService: '',
      selectedDate: null,
      selectedTimeSlot: null,
      unavailableDates: [], // List of unavailable dates
      unavailableTimeSlots: {}, // Object with date as key and unavailable slots as values
      availableTimeSlots: [], // Time slots filtered for the selected date
      errors: {}, // Error messages for form validation
    };
  },
  mounted() {
    this.fetchServices();
    this.fetchUnavailableDates(); // Fetch unavailable dates when the component is mounted
    this.initializeDatePicker();
  },
  methods: {
    // Fetch available services
    async fetchServices() {
      try {
        const response = await axios.get('/api/book');
        this.services = response.data;
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },

    // Fetch unavailable dates and time slots
    async fetchUnavailableDates() {
      try {
        const response = await axios.get('/api/bookings/unavailable');
        this.unavailableDates = response.data.dates;
        this.unavailableTimeSlots = response.data.timeSlots;
      } catch (error) {
        console.error('Error fetching unavailable dates:', error);
      }
    },

    // Initialize Pikaday date picker
    initializeDatePicker() {
      const self = this;
      new Pikaday({
        field: this.$refs.datepicker,
        format: 'YYYY-MM-DD',
        theme: 'dark-theme',
        disableDayFn(date) {
          const dateString = date.toISOString().split('T')[0];
          return self.unavailableDates.includes(dateString); // Disable unavailable dates
        },
        onSelect(date) {
          const selected = date.toISOString().split('T')[0];
          self.selectedDate = selected;
          self.updateAvailableTimeSlots(selected);
        },
      });
    },

    // Update available time slots based on the selected date
    updateAvailableTimeSlots(date) {
      const unavailableSlots = this.unavailableTimeSlots[date] || [];
      const allSlots = [
        '9:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '1:00 PM',
        '2:00 PM',
        '3:00 PM',
        '4:00 PM',
      ];
      this.availableTimeSlots = allSlots.filter((slot) => !unavailableSlots.includes(slot) && slot !== null);
    },

    // Validate the booking form
    validateForm() {
      this.errors = {};
      if (!this.selectedService) this.errors.service = 'Please select a service.';
      if (!this.selectedDate) this.errors.date = 'Please select a date.';
      if (!this.selectedTimeSlot) this.errors.timeSlot = 'Please select a time slot.';
      return Object.keys(this.errors).length === 0;
    },

    // Book a service
    async bookService() {
      if (!this.validateForm()) return;

      const payload = {
        serviceTitle: this.selectedService === 'custom' ? null : this.selectedService,
        customTitle: this.selectedService === 'custom' ? this.customService : null,
        date: this.selectedDate,
        timeSlot: this.selectedTimeSlot,
      };

      try {
        await axios.post('/api/booking', payload, { withCredentials: true });
        alert('Booking confirmed!');
        this.resetForm();
      } catch (error) {
        console.error('Error creating booking:', error);

        if (error.response && error.response.data && error.response.data.message) {
          this.errors.general = error.response.data.message;
        } else {
          this.errors.general = 'Failed to book. Please try again.';
        }
      }
    },

    // Reset form after successful booking
    resetForm() {
      this.selectedService = null;
      this.customService = '';
      this.selectedDate = null;
      this.selectedTimeSlot = null;
      this.availableTimeSlots = [];
    },
  },
};
</script>

<style>
@import '~pikaday/css/pikaday.css';

/* Calendar Theme */
.light-theme .pika-single {
  background: #f9f9f9;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.light-theme .pika-title {
  background: #007bff;
  color: #fff;
  font-weight: bold;
}

.light-theme .pika-lendar {
  background: #fff;
}

.light-theme .is-today {
  background: #007bff;
  color: #fff;
}

/* Page Styles */
.booking-system {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-message {
  color: #d9534f;
  font-size: 0.875rem;
}
</style>