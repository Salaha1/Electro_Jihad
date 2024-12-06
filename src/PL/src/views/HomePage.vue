<template>
  <div class="whole-page">
    <!-- Navbar -->
    <NavBar />

    <!-- Full-Width Background Image -->
    <div class="background-image-section">
      <div class="background-content">
        <p>Electro Jihad - Your Car’s Best Companion</p>
      </div>
    </div>

    <!-- Welcome Message -->
    <div v-if="isAuthenticated" class="welcome-message">
      Welcome, {{ username }}!
    </div>

    <!-- Services Section -->
    <ServicesSection />

    <!-- Footer -->
    <FooterSection />
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import FooterSection from '../components/FooterSection.vue';
import ServicesSection from '../components/ServicesSection.vue';

export default {
  name: 'HomePage',
  components: {
    NavBar,
    ServicesSection,
    FooterSection,
  },
  data() {
    return {
      isAuthenticated: false, // This should reflect the authentication state
      username: '', // User's name will be stored here
    };
  },
  async mounted() {
    try {
      // Make the fetch request with credentials
      const response = await fetch('/api/auth/check', {
        method: 'GET', // Request method
        credentials: 'include', // This ensures cookies (like session cookies) are sent with the request
      });

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        const data = await response.json(); // Parse the JSON response
        console.log(data); 
        this.isAuthenticated = true;
        this.username = data.username; // Set the username from the response
      }
    } catch (error) {
      console.log('Not authenticated');
      this.isAuthenticated = false;
    }
  }

};
</script>

<style scoped>
/* Welcome Message Section */
.welcome-message {
  margin: 20px auto;
  max-width: 1200px;
  padding-left: 20px;
  text-align: left;
  font-size: 1.5rem;
  font-weight: bold;
  animation: colorChange 3s infinite; /* Apply the animation */
  
}

/* Keyframes for color animation */
@keyframes colorChange {
  0% {
    color: #ffcc00; /* Bright orange */
  }
  33% {
    color: #373937; /* Bright green */
  }
  66% {
    color: #ffffff; /* Bright blue */
  }
  100% {
    color: #383737; /* Back to the original */
  }
}

/* Background Section */
.background-image-section {
  width: 100vw;
  height: 400px;
  background-image: url('../assets/Garage05.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.background-content {
  color: #c2c0c0;
  text-align: center;
  padding: 15px;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 900px;
}

.whole-page {
  background-color: rgb(126, 126, 126);
}
@media (max-width: 600px) {
  .welcome-message {
    font-size: 1.2rem;
  }
}
</style>