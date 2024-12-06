<template>
    <div>
      <!-- Navbar -->
      <NavBar />
  
      <!-- Buy Car Section -->
      <section class="buy-car-section">
        <h1>Available Cars for Sale</h1>
        <p>Browse through our collection and find your dream car!</p>
  
        <div class="car-grid">
          <div
            v-for="(car, index) in cars"
            :key="index"
            class="car-card"
          >
            <img
              :src="car.image"
              :alt="car.brand"
              class="car-image"
              @click="viewCarDetails(car.id)"
            />
            <div class="car-details">
              <h2>{{ car.brand }}</h2>
              <p class="car-price">Price: ${{ car.price }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <FooterSection />
    </div>
  </template>
  
  <script>
  import NavBar from "../components/NavBar.vue";
  import FooterSection from "../components/FooterSection.vue";
  import axios from 'axios';

  
  export default {
  name: 'BuyCarPage',
  components: {
    NavBar,
    FooterSection
  },
  data() {
    return {
      cars: []
    };
  },
  methods: {
    async fetchCars() {
    try {
        const response = await axios.get('/api/cars-for-sale');
        console.log('API Response:', response.data); // Debugging: Check response data
        this.cars = response.data; // Assign the data to the `cars` array
    } catch (error) {
        console.error('Error fetching cars:', error);
    }
    }
    ,
    viewCarDetails(carId) {
      this.$router.push({ name: 'CarDetailsPage', params: { id: carId } });
    },
    getImageURL(blob) {
      if (!blob) return ''; // Handle missing images
      const arrayBufferView = new Uint8Array(blob.data);
      const blobData = new Blob([arrayBufferView]);
      return URL.createObjectURL(blobData); // Convert BLOB to object URL
    }
  },
  created() {
    this.fetchCars(); // Fetch cars when the component is created
  }
};
  </script>
  
  <style scoped>
  .buy-car-section {
    padding: 20px;
    background-color: #f9f9f9;
    text-align: center;
    height: 100vh;
  }
  
  h1 {
    color: #333;
  }
  
  .car-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 cars per row */
    gap: 20px;
    margin-top: 20px;
  }
  
  .car-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .car-card:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
  
  .car-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    cursor: pointer;
  }
  
  .car-details {
    padding: 15px;
  }
  
  .car-details h2 {
    margin: 10px 0;
    font-size: 18px;
    color: #333;
  }
  
  .car-price {
    font-size: 16px;
    color: #555;
  }
  
  /* Responsive Styling */
  @media (max-width: 1200px) {
    .car-grid {
      grid-template-columns: repeat(3, 1fr); /* 3 cars per row on medium screens */
    }
  }
  
  @media (max-width: 768px) {
    .car-grid {
      grid-template-columns: repeat(2, 1fr); /* 2 cars per row on small screens */
    }
  }
  
  @media (max-width: 480px) {
    .car-grid {
      grid-template-columns: 1fr; /* 1 car per row on very small screens */
    }
  }
  </style>
  