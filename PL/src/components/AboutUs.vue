<template>
    <div class="about-us">
      <div class="text-section">
        <h2>About Us</h2>
        <p>
          Our journey began with a passion for cars and a desire to provide top-notch car electrician services
          alongside a trusted car dealership. Over the years, we've grown into a reputable name in the industry, 
          serving countless satisfied customers.
        </p>
        <p>
          Whether you're looking for expert car repairs or your next dream car, we are here to help with unmatched
          dedication and quality.
        </p>
      </div>
  
      <div class="video-section">
        <h2>Our Story</h2>
        <!-- Video Section -->
        <video autoplay muted loop class="about-video">
          <source src="../assets/GarageV1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AboutUs",
  };
  </script>
  
  <style scoped>
 .about-us {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  width: 100%; /* Fix width */
  margin: 0 auto;
  background-color: rgba(11, 11, 11, 0.37);
}
  .text-section {
    flex: 1;
  }
  
  .text-section h2 {
    margin-bottom: 10px;
  }
  
  .text-section p {
    margin-bottom: 10px;
    line-height: 1.6;
  }
  
  .video-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .video-section h2 {
    margin-bottom: 10px;
  }
  
  .about-video {
    width: 100%;
    max-width: 500px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  </style>