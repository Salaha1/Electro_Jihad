<template>
    <section class="services-section">
      <h2>Our Services</h2>
      <div class="services-container">
        <!-- Card Component -->
        <ServiceCard
          icon="🔧"
          title="Diagnostics"
          description="Complete electrical system check"
        />
        <ServiceCard
          icon="🚗"
          title="Used Cars"
          description="Quality pre-owned vehicles"
        />
        <ServiceCard
          icon="📅"
          title="Book Service"
          description="Schedule your appointment"
        />
      </div>
    </section>
  </template>
  
  <script>
  import ServiceCard from "./ServiceCard.vue";
  
  export default {
    name: "ServicesSection",
    components: {
      ServiceCard,
    },
  };
  </script>
  
  <style scoped>
  .services-section {
  display: flex; /* Use flexbox for centering */
  flex-direction: column; /* Stack heading and cards vertically */
  align-items: center; /* Horizontally center items */
  text-align: center;
  padding: 40px 20px; /* Add padding for spacing (less than before) */
  
  margin: 0 auto; /* Center the section horizontally */
  
}

.services-section h2 {
  font-size: 2rem;
  color: #000000;
  
  padding: 15px 60px; /* Adjust padding for the heading */
  border-radius: 15px; /* Add rounded corners */
  margin-bottom: 20px; /* Reduce space below the heading */
  width: fit-content; /* Dynamic width based on content */
}

.services-container {
  display: flex; /* Arrange cards in a row */
  justify-content: center; /* Center cards horizontally */
  gap: 20px; /* Space between cards */
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  max-width: 1200px; /* Set a max-width for better layout */
}
  </style>