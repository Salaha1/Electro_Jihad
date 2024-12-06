<template>
  <div class="diagnostics-card">
    <h3>Diagnostics</h3>
    <p>Select a symptom to diagnose your vehicle:</p>
    
    <select v-model="selectedSymptom" @change="fetchSymptomDetails">
      <option disabled value="">-- Select a Symptom --</option>
      <option v-for="symptom in symptoms" :key="symptom._id" :value="symptom._id">
        {{ symptom.name }}
      </option>
    </select>

    <!-- New Symptom Request Form for Normal Users -->
    <div v-if="!isAdmin">
      <h4>Request a New Symptom</h4>
      <input v-model="newSymptomName" type="text" placeholder="Enter new symptom name" />
      <button @click="submitNewSymptom">Submit</button>
      <p v-if="submissionStatus" :class="submissionStatusClass">{{ submissionStatus }}</p>
    </div>

    <div v-if="symptomDetails">
      <h4>Details for: {{ symptomDetails.name }}</h4>
      <p><strong>Possible Causes:</strong> {{ symptomDetails.causes.join(", ") }}</p>
      <p><strong>Solutions:</strong> {{ symptomDetails.solutions.join(", ") }}</p>
      <p><strong>Severity:</strong> {{ symptomDetails.severity }}</p>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      symptoms: [],
      selectedSymptom: '',
      symptomDetails: null,
      newSymptomName: '',  // New symptom name input by the user
      submissionStatus: null,  // Status of the symptom submission
      submissionStatusClass: '',  // Class for styling submission status
      loading: false,
      isAdmin: false, // Use a variable to check if the user is an admin
    };
  },
  created() {
    this.fetchSymptoms();  // Fetch symptoms on component creation
  },
  methods: {
    // Fetch list of symptoms with "Reviewed" status
    async fetchSymptoms() {
      this.loading = true;
      try {
        // Call the backend with a filter for "Reviewed" status
        const response = await axios.get('http://localhost:5000/api/symptoms?status=Reviewed');
        this.symptoms = response.data;
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch details for a selected symptom
    async fetchSymptomDetails() {
      if (!this.selectedSymptom) return;
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:5000/api/symptoms/${this.selectedSymptom}`);
        this.symptomDetails = response.data;
      } catch (error) {
        console.error("Error fetching symptom details:", error);
      } finally {
        this.loading = false;
      }
    },

    // Submit a new symptom request (for normal users)
    async submitNewSymptom() {
      if (!this.newSymptomName) {
        return alert('Please enter a symptom name.');
      }
      this.loading = true;
      try {
        const response = await axios.post('/api/symptoms/request', {
          name: this.newSymptomName
        });
        this.submissionStatus = 'Symptom submitted successfully and is pending admin review.';
        this.submissionStatusClass = 'success';
        this.newSymptomName = '';  // Clear input after submission
      } catch (error) {
        console.error("Error submitting symptom:", error);
        this.submissionStatus = 'Failed to submit symptom. Please try again.';
        this.submissionStatusClass = 'error';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.diagnostics-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

select {
  margin: 10px 0;
  padding: 8px;
  width: 100%;
}

input {
  padding: 8px;
  margin: 10px 0;
  width: 100%;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.loading {
  color: #007bff;
  font-size: 16px;
  margin-top: 10px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>