<template>
    <div>
      <!-- Navbar -->
      <NavBar />
  
      <!-- Car Dealer Options Section -->
      <section class="car-dealer-section">
        <h1>Welcome to Car Dealer</h1>
        <p>What would you like to do?</p>
        <div class="options-container">
          <!-- Buy Car Option -->
          <div class="option-card" @click="handleBuyCar">
            <h2>Buy Car</h2>
            <p>Browse and purchase your dream car!</p>
          </div>
  
          <!-- Sell Car Option -->
          <div class="option-card" @click="handleSellCar">
            <h2>Sell Car</h2>
            <p>List your car and find a buyer quickly!</p>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <FooterSection />
    </div>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import FooterSection from '../components/FooterSection.vue';
  
  export default {
    name: "CarDealer",
    components: {
      NavBar,
      FooterSection
    },
    methods: {
      // Redirect to Buy Car page
      handleBuyCar() {
        this.$router.push({ name: 'BuyCarPage' });
      },
      // Redirect to Sell Car page
      handleSellCar() {
        this.$router.push({ name: 'SellCarPage' });
      }
    }
  };
  </script>
  
  <style scoped>
  .car-dealer-section {
    padding: 20px;
    background-color: #f4f4f4;
    text-align: center;
    height: 100vh;
  }
  
  h1 {
    color: #333;
  }

  
  
  .options-container {
    height: 28vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 40px;
    margin-top: 20px;
    flex-wrap: wrap; /* Ensure wrapping on smaller screens */
  }
  
  .option-card {
    flex: 1 1 30%; /* Each card takes up to 30% width */
    max-width: 300px;
    padding: 100px;
    background-color: #c6baba;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, background-color 0.3s ease;
    text-align: center;
  }
  
  .option-card:hover {
    background-color: #ff9900;
    transform: scale(1.05);
  }
  
  .option-card h2 {
    margin: 10px 0;
  }
  
  .option-card p {
    font-size: 14px;
  }
  
  /* Responsive Styling */
  @media (max-width: 768px) {
    .options-container {
      flex-direction: column;
      align-items: center;
    }
  
    .option-card {
      max-width: 90%;
      margin-bottom: 20px;
    }
  }
  </style>
  