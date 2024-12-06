<template>
    <div>
      <!-- Navbar -->
      <NavBar />
  
      <!-- Car Details Section -->
      <section class="car-details-section">
        <div v-if="loading">
          <p>Loading car details...</p>
        </div>
  
        <div v-else-if="error">
          <p>{{ error }}</p>
          <button @click="goBack">Back to Buy Cars</button>
        </div>
  
        <div v-else>
          <h1>{{ car.brand }} - ${{ car.price }}</h1>
          <img :src="car.image" :alt="car.brand" class="car-image" />
  
          <div class="car-info">
            <h2>Details</h2>
            <ul>
              <li><strong>Brand:</strong> {{ car.brand }}</li>
              <li><strong>Model:</strong> {{ car.model }}</li>
              <li><strong>Color:</strong> {{ car.color }}</li>
              <li><strong>Kilometers Traveled:</strong> {{ car.kilometers }} km</li>
              <li><strong>Engine:</strong> {{ car.engine }}</li>
              <li><strong>Price:</strong> {{ car.price }}$</li>
            </ul>
          </div>
  
          <button @click="goBack">Back to Buy Cars</button>
        </div>
      </section>
  
      <!-- Footer -->
      <FooterSection />
    </div>
  </template>
  
  <script>
  import NavBar from "../components/NavBar.vue";
  import FooterSection from "../components/FooterSection.vue";
  import axios from "axios";
  
  export default {
    name: "CarDetailsPage",
    components: {
      NavBar,
      FooterSection,
    },
    data() {
      return {
        car: null, // Placeholder for car details
        loading: true, // Loading state
        error: null, // Error state
      };
    },
    created() {
      // Fetch car details using the car ID from route parameters
      const carId = this.$route.params.id;
      this.fetchCarDetails(carId);
    },
    methods: {
      async fetchCarDetails(carId) {
        try {
          const response = await axios.get(`/api/car-details/${carId}`); // Updated API endpoint
          this.car = response.data; // Assign the fetched car to the `car` variable
        } catch (error) {
          console.error("Error fetching car details:", error);
          this.error = "Failed to load car details. Please try again later.";
        } finally {
          this.loading = false; // Stop the loading spinner
        }
      },
      goBack() {
        this.$router.push({ name: "BuyCarPage" });
      },
    },
  };
  </script>
  
  <style scoped>
  .car-details-section {
    padding: 20px;
    text-align: center;
    background-color: #f9f9f9;
    height: 100vh;
  }
  
  h1 {
    color: #2a7ae4; /* Updated font color for the main heading */
  }
  
  .car-image {
    width: 100%;
    max-width: 600px;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .car-info {
    margin-top: 20px;
    text-align: left;
    display: inline-block;
  }
  
  .car-info h2 {
    color: #333; /* Updated font color for the "Details" heading */
    margin-bottom: 10px;
  }
  
  .car-info ul {
    list-style: none;
    padding: 0;
  }
  
  .car-info li {
    margin: 5px 0;
    font-size: 16px;
    color: #444; /* Updated font color for list items */
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #ffcc00;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #333; /* Updated font color for the button text */
    font-size: 16px;
  }
  
  button:hover {
    background-color: #ff9900;
  }
  </style>
  