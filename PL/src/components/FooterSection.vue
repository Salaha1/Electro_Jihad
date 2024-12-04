<template>
  <footer id="contact" class="footer-section">
    <div class="footer-container">

<!-- Navigation Links (Optional for better UX) -->
<div class="footer-nav">
        <a href="/" class="footer-link">Home</a>
        <a href="/services" class="footer-link">Services</a>
        <a href="/about" class="footer-link">About Us</a>
        
      </div>

      <!-- Footer Content -->
      <div class="footer-content">
        <p>&copy; 2024 Car Electrician & Dealership. All rights reserved.</p>
        <p>+961 76327774</p>
      </div>

      <!-- Social Icons -->
      <div class="social-icons">
        <a href="#" class="social-icon" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="#" class="social-icon" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="social-icon" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
};
</script>

<style scoped>
/* Footer Section Styling */
.footer-section {
  background-color: #1c1c1c;
  color: #fff;
  padding: 40px 20px;
  margin-top: auto; /* Push footer to the bottom */
  text-align: center;
}

.footer-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  align-items: center;
  text-align: center;
}



.footer-content p {
  margin: 0 0;
  font-size: 1rem;
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.footer-link {
  color: #fdd835;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease-in-out;
}

.footer-link:hover {
  color: #fbc02d;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.social-icon {
  color: #fdd835;
  font-size: 1.5rem;
  transition: color 0.3s ease-in-out;
}

.social-icon:hover {
  color: #fbc02d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-content p {
    font-size: 0.9rem;
  }

  .footer-link {
    font-size: 0.9rem;
  }

  .social-icon {
    font-size: 1.2rem;
  }
}
</style>