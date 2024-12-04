<template>
    <div class="service-card">
      <div class="service-icon">{{ icon }}</div>
      <h3 class="service-title">{{ title }}</h3>
      <p class="service-description">{{ description }}</p>
      <a href="#" class="learn-more">Learn More →</a>
    </div>
  </template>
  
  <script>
  export default {
    name: "ServiceCard",
    props: {
      icon: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .service-card {
    background-color: #1e1e1e;
    border: 1px solid #fdd835;
    border-radius: 10px;
    padding: 20px;
    width: 300px;
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .service-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  }
  
  .service-icon {
    font-size: 2rem;
    color: #fdd835;
    margin-bottom: 15px;
  }
  
  .service-title {
    font-size: 1.5rem;
    color: #fdd835;
    margin-bottom: 10px;
  }
  
  .service-description {
    font-size: 1rem;
    color: #aaa;
    margin-bottom: 15px;
  }
  
  .learn-more {
    text-decoration: none;
    color: #fdd835;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .learn-more:hover {
    text-decoration: underline;
  }
  </style>