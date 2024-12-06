<template>
  <div>
    <!-- Navbar -->
    <NavBar />
    
    <!-- Services Section -->
    <section class="services-section">
      <!-- Diagnostics Component -->
      <div class="service-card">
        <Diagnostics />
      </div>

      <!-- Car Comparator Component -->
      <div class="service-card">
        <CarComparator />
      </div>
    </section>

    <!-- Booking System Section -->
    <section class="booking-section">
      <BookingSystem /> 
    </section>

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script>
import Diagnostics from '../components/Diagnostics.vue';
import CarComparator from '../components/CarComparator.vue';

import NavBar from '../components/NavBar.vue';
import FooterSection from '../components/FooterSection.vue';
import BookingSystem from '../components/BookingSystem.vue';

export default {
  name: "ServicesPage",
  components: {
    NavBar,
    Diagnostics,
    CarComparator,
    BookingSystem,
    FooterSection
  },
  methods: {
    // Handle the booking confirmation
    handleBookingConfirmation() {
      // Simulate sending confirmation email here
      this.sendConfirmationEmail();

      // After confirmation, redirect to AboutContactPage and GoogleMaps.vue
      this.$router.push({ name: 'AboutContactPage', query: { section: 'googleMaps' } });
    },

    // Method to simulate sending a confirmation email
    sendConfirmationEmail() {
      // In real-life use a service like email.js or a backend server for sending emails
      console.log("Confirmation email sent!");
    }
  }
};
</script>

<style scoped>
/* Services section layout */
.services-section {
  padding: 20px;
  background-color: #c6baba;
  display: flex;
  flex-direction: row;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap; /* Ensure wrapping on smaller screens */
  margin-top: 65px;
}

.service-card {
  flex: 1 1 45%; /* Allow each card to take up to 45% width */
  max-width: 45%;
  background-color: #c6baba;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.booking-section {
  
  padding: 20px;
  background-color: #c6baba;
  text-align: center;
}

button {
  margin-top: 20px;
  background-color: #ffcc00;
  color: #333;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ff9900;
}

/* Responsive styling for smaller screens */
@media (max-width: 768px) {
  .services-section {
    flex-direction: column;
    align-items: center;
  }

  .service-card {
    max-width: 90%;
    margin-bottom: 20px; /* Space between the two cards */
  }
}
</style>