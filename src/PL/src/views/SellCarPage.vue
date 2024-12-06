<template>
    <div>
      <!-- Navbar -->
      <NavBar />
  
      <!-- Sell Car Form Section -->
      <section class="sell-car-section">
        <h1>Sell Your Car</h1>
        <p>Fill in the details below to list your car for sale.</p>
  
        <form @submit.prevent="handleFormSubmit" class="sell-car-form">
          <!-- Car Brand -->
          <div class="form-group">
            <label for="brand">Car Brand</label>
            <input
              type="text"
              id="brand"
              v-model="formData.brand"
              placeholder="Enter car brand"
              required
            />
          </div>
  
          <!-- Car Model -->
          <div class="form-group">
            <label for="model">Car Model</label>
            <input
              type="text"
              id="model"
              v-model="formData.model"
              placeholder="Enter car model"
              required
            />
          </div>
  
          <!-- Car Color -->
          <div class="form-group">
            <label for="color">Car Color</label>
            <input
              type="text"
              id="color"
              v-model="formData.color"
              placeholder="Enter car color"
              required
            />
          </div>
  
          <!-- Kilometers Traveled -->
          <div class="form-group">
            <label for="kilometers">Kilometers Traveled</label>
            <input
              type="number"
              id="kilometers"
              v-model="formData.kilometers"
              placeholder="Enter kilometers traveled"
              required
            />
          </div>
  
          <!-- Engine -->
          <div class="form-group">
            <label for="engine">Engine</label>
            <input
              type="text"
              id="engine"
              v-model="formData.engine"
              placeholder="Enter engine details"
              required
            />
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <input
              type="text"
              id="price"
              v-model="formData.price"
              placeholder="Enter price"
              required
            />
          </div>
  
          <!-- Upload Images -->
          <div class="form-group">
            <label for="images">Upload Images</label>
            <input
              type="file"
              id="images"
              @change="handleImageUpload"
              multiple
              accept="image/*"
            />
          </div>
  
          <!-- Submit Button -->
          <button type="submit">Submit</button>
        </form>
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
    name: "SellCarPage",
    components: {
      NavBar,
      FooterSection
    },
    data() {
      return {
        formData: {
          brand: "",
          model: "",
          color: "",
          kilometers: "",
          engine: "",
          price: "",
          images: []
        }
      };
    },
    methods: {
      async handleFormSubmit() {
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append("brand", this.formData.brand);
    formData.append("model", this.formData.model);
    formData.append("color", this.formData.color);
    formData.append("kilometers", this.formData.kilometers);
    formData.append("engine", this.formData.engine);
    formData.append("price", this.formData.price);

    // Append images with the correct field name
    this.formData.images.forEach(image => {
      formData.append("images", image); // Ensure "images" matches multer configuration
    });

    // Send POST request
    const response = await axios.post("http://localhost:5000/api/add-car", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Car added successfully:", response.data);
    alert("Car added successfully!");

    // Reset the form after successful submission
    this.resetForm();
  } catch (error) {
    console.error("Error adding car:", error);
    alert("Failed to add car. Please try again.");
  }
},
      handleImageUpload(event) {
        const files = event.target.files;
        if (files) {
          this.formData.images = Array.from(files);
          console.log("Uploaded Images:", this.formData.images);
        }
      },
      resetForm() {
        this.formData = {
          brand: "",
          model: "",
          color: "",
          kilometers: "",
          price: "",
          engine: "",
          images: []
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .sell-car-section {
    padding: 20px;
    background-color: #f9f9f9;
    text-align: center;
  }
  
  h1 {
    color: #333;
  }
  
  .sell-car-form {
    max-width: 600px;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="file"] {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #ffcc00;
    color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #ff9900;
  }
  </style>