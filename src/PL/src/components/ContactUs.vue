<template>
    <div class="contact-us">
      <div class="info-section">
        <h2>Contact Information</h2>
        <div class = "text1">
        <p><strong>Phone:</strong> +1 (123) 456-7890</p>
        <p><strong>Email:</strong> info@garageanddealer.com</p>
        <p><strong>Address:</strong> 123 Main Street, City, Country</p>
  </div>
        <h3>Opening Hours</h3>
        <ul>
          <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
          <li>Saturday: 10:00 AM - 4:00 PM</li>
          <li>Sunday: Closed</li>
        </ul>
  
        <!-- Get Directions Button -->
        <button @click="getDirections" class="directions-button">Get Directions</button>
      </div>
  
      <div class="map-section">
        <h2>Find Us Here</h2>
        <div class="map-container">
          <!-- Google Maps Embed -->
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d827.7757993624012!2d35.58902028064117!3d33.91274347582359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2slb!4v1733249314112!5m2!1sen!2slb" 
            width="600" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ContactUs",
    methods: {
      getDirections() {
        // Replace these coordinates with your location
        const latitude = 33.912743;
        const longitude = 35.589020;
  
        // Google Maps URL for directions
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        
        // Open the URL
        window.open(googleMapsUrl, "_blank");
      },
    },
  };
  </script>
  
  <style scoped>
 .contact-us {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  width: 100%; /* Fix width */
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.4);
}
  
  .info-section {
    flex: 1;
    
    
  }
  .info-section
  .info-section h2,
  .info-section h3 {
    margin-bottom: 10px;
    
    
  }
  
  .info-section p,
  .info-section ul {
    margin-bottom: 10px;
    
   
  margin-left: 0;
}
  

  .text1{
    margin-top:90px;
    
  }
  .info-section ul {
    list-style: none;
    padding: 0;
  }
  
  .info-section li {
    margin-bottom: 5px;
  }
  
  .map-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .map-container {
    width: 100%;
    max-width: 500px;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .directions-button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  .map-container iframe {
  width: 100%;
  max-width: 500px;
  border: none;
}
  
  .directions-button:hover {
    background-color: #0056b3;
  }
  </style>