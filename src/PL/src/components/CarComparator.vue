<template>
  <div class="car-comparator">
    <h3>Compare Cars</h3>

    <!-- Car Selection with Smart Search -->
    <div class="car-selection">
      <!-- Car 1 Search -->
      <div class="car-search">
        <label for="car-1-make">Search First Car Make:</label>
        <input
          id="car-1-make"
          type="text"
          v-model="searchCar1Make"
          placeholder="Search car make..."
          class="search-box"
          @input="filterMakes('car1')"
        />
        <ul v-if="filteredMakes1.length" class="suggestions">
          <li v-for="(make, index) in filteredMakes1" :key="index" @click="selectCarMake('car1', make)">
            {{ make }}
          </li>
        </ul>

        <label for="car-1-model">Search First Car Model:</label>
        <input
          id="car-1-model"
          type="text"
          v-model="searchCar1Model"
          placeholder="Search car model..."
          class="search-box"
          @input="filterModels('car1')"
        />
        <ul v-if="filteredModels1.length" class="suggestions">
          <li v-for="(model, index) in filteredModels1" :key="index" @click="selectCarModel('car1', model)">
            {{ model }}
          </li>
        </ul>
      </div>

      <!-- Car 2 Search -->
      <div class="car-search">
        <label for="car-2-make">Search Second Car Make:</label>
        <input
          id="car-2-make"
          type="text"
          v-model="searchCar2Make"
          placeholder="Search car make..."
          class="search-box"
          @input="filterMakes('car2')"
        />
        <ul v-if="filteredMakes2.length" class="suggestions">
          <li v-for="(make, index) in filteredMakes2" :key="index" @click="selectCarMake('car2', make)">
            {{ make }}
          </li>
        </ul>

        <label for="car-2-model">Search Second Car Model:</label>
        <input
          id="car-2-model"
          type="text"
          v-model="searchCar2Model"
          placeholder="Search car model..."
          class="search-box"
          @input="filterModels('car2')"
        />
        <ul v-if="filteredModels2.length" class="suggestions">
          <li v-for="(model, index) in filteredModels2" :key="index" @click="selectCarModel('car2', model)">
            {{ model }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Compare Button -->
    <button v-if="isCar1Selected && isCar2Selected" class="compare-button" @click="compareCars">
      Compare
    </button>
    <div v-if="comparisonVisible" class="car-comparison">
  <div v-if="car1Details" class="car-details">
    <div class="car-image-container">
      <img v-if="car1Details.image" :src="car1Details.image" alt="Car 1" class="car-image" />
    </div>
    <h4>{{ car1Details.name }}</h4>
    <p>Engine: {{ car1Details.engine }}</p>
    <p>Cylinders: {{ car1Details.cylinders }}</p>
    <p>Fuel Capacity: {{ car1Details.fuelCapacity }} liters</p>
    <p>Horsepower: {{ car1Details.horsepower }} HP</p>
    <p>Price: ${{ car1Details.price }}</p>
  </div>

  <div v-if="car2Details" class="car-details">
    <div class="car-image-container">
      <img v-if="car2Details.image" :src="car2Details.image" alt="Car 2" class="car-image" />
    </div>
    <h4>{{ car2Details.name }}</h4>
    <p>Engine: {{ car2Details.engine }}</p>
    <p>Cylinders: {{ car2Details.cylinders }}</p>
    <p>Fuel Capacity: {{ car2Details.fuelCapacity }} liters</p>
    <p>Horsepower: {{ car2Details.horsepower }} HP</p>
    <p>Price: ${{ car2Details.price }}</p>
  </div>
</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carMakes: [],
      carModels1: [],
      carModels2: [],
      selectedCar1Make: '',
      selectedCar1Model: '',
      selectedCar2Make: '',
      selectedCar2Model: '',
      searchCar1Make: '',
      searchCar1Model: '',
      searchCar2Make: '',
      searchCar2Model: '',
      filteredMakes1: [],
      filteredMakes2: [],
      filteredModels1: [],
      filteredModels2: [],
      car1Details: null,
      car2Details: null,
      unsplashApiKey: 'qE9NXzQoUZQHHysrjCpP7_nViVHJx7VvEyDNBf7L1gc', // Replace with your Unsplash API key
      isCar1Selected: false,
      isCar2Selected: false,
      makeSearchTimeout1: null,
      makeSearchTimeout2: null,
      comparisonVisible: false,
    };
  },
  mounted() {
    this.fetchCarMakes();
  },
  methods: {
    fetchCarMakes() {
      fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json')
        .then((response) => response.json())
        .then((data) => {
          this.carMakes = data.Results.map((make) => make.Make_Name);
        })
        .catch((error) => {
          console.error('Error fetching car makes:', error);
        });
    },
    filterMakes(car) {
      const searchTerm = car === 'car1' ? this.searchCar1Make : this.searchCar2Make;
      const filteredMakes = this.carMakes.filter((make) =>
        make.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (car === 'car1') this.filteredMakes1 = filteredMakes;
      if (car === 'car2') this.filteredMakes2 = filteredMakes;
    },
    selectCarMake(car, make) {
      if (car === 'car1') {
        this.selectedCar1Make = make;
        this.searchCar1Make = make;
        this.isCar1Selected = true;
        this.fetchCarModels('car1');
      } else {
        this.selectedCar2Make = make;
        this.searchCar2Make = make;
        this.isCar2Selected = true;
        this.fetchCarModels('car2');
      }
      this.filteredMakes1 = [];
      this.filteredMakes2 = [];
    },
    filterModels(car) {
      const searchTerm = car === 'car1' ? this.searchCar1Model : this.searchCar2Model;
      const models = car === 'car1' ? this.carModels1 : this.carModels2;
      const filteredModels = models.filter((model) =>
        model.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (car === 'car1') this.filteredModels1 = filteredModels;
      if (car === 'car2') this.filteredModels2 = filteredModels;
    },
    selectCarModel(car, model) {
      if (car === 'car1') {
        this.selectedCar1Model = model;
        this.searchCar1Model = model;
      } else {
        this.selectedCar2Model = model;
        this.searchCar2Model = model;
      }
      this.fetchCarDetails(car);
    },
    fetchCarModels(car) {
      const selectedMake = car === 'car1' ? this.selectedCar1Make : this.selectedCar2Make;
      if (selectedMake) {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${selectedMake}?format=json`)
          .then((response) => response.json())
          .then((data) => {
            const models = data.Results.map((model) => model.Model_Name);
            if (car === 'car1') this.carModels1 = models;
            if (car === 'car2') this.carModels2 = models;
          })
          .catch((error) => {
            console.error('Error fetching car models:', error);
          });
      }
    },
    fetchCarDetails(car) {
      const selectedMake = car === 'car1' ? this.selectedCar1Make : this.selectedCar2Make;
      const selectedModel = car === 'car1' ? this.selectedCar1Model : this.selectedCar2Model;
      if (selectedMake && selectedModel) {
        const query = `${selectedMake} ${selectedModel}`;
        const url = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
          query
        )}&client_id=${this.unsplashApiKey}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const details = {
              name: query,
              engine: 'V6', // Example static data
              cylinders: 6,
              fuelCapacity: 70,
              horsepower: 300,
              price: 70000,
              image: data.results[0]?.urls?.small || '',
            };
            if (car === 'car1') this.car1Details = details;
            if (car === 'car2') this.car2Details = details;
          })
          .catch((error) => {
            console.error('Error fetching car details:', error);
          });
      }
    },
    compareCars() {
      this.comparisonVisible = true;
    },
  },
};
</script>

<style scoped>
.car-comparator {
  max-width: 800px;
  margin: 0 auto;
  margin-top:50px;
}
h3 {
  text-align: center;
  font-family: Arial, sans-serif;
  color: #333;
}
.car-selection {
  display: flex;
  justify-content: space-between;  /* Ensures equal spacing */
  margin-bottom: 20px;
}

.car-search {
  width: 48%;  /* Adjust width to allow space between the sections */
  display: flex;
  flex-direction: column;
}

.search-box {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.suggestions {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
}

.suggestions li {
  padding: 8px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}
.compare-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.compare-button:hover {
  background-color: #0056b3;
}
.car-comparison {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
.car-details {
  text-align: center;
  width: 45%;
}
.car-image-container {
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.car-image {
  max-height: 100%;
  max-width: 100%;
}
</style>