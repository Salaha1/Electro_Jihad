<template>
  <div class="admin-pending-symptoms">
    <h3>Manage Symptoms</h3>
    <p>Select a status to filter symptoms:</p>

    <!-- Dropdown to toggle between Pending and Reviewed -->
    <select v-model="statusFilter" @change="fetchSymptoms" class="status-dropdown">
      <option value="Pending">Pending</option>
      <option value="Reviewed">Reviewed</option>
    </select>

    <!-- Table to display the list of symptoms based on selected status -->
    <table class="symptom-table">
      <thead>
        <tr>
          <th>Title</th>
          <!-- Conditionally render these columns only for Reviewed status -->
          <th v-if="statusFilter === 'Reviewed'">Severity</th>
          <th v-if="statusFilter === 'Reviewed'">Causes</th>
          <th v-if="statusFilter === 'Reviewed'">Solutions</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredSymptoms.length === 0">
          <td colspan="6">No symptoms available for the selected status.</td>
        </tr>
        <tr v-for="symptom in filteredSymptoms" :key="symptom._id">
          <td>{{ symptom.name }}</td>

          <!-- Conditionally render Severity, Causes, and Solutions for Reviewed status only -->
          <td v-if="statusFilter === 'Reviewed'">{{ symptom.severity || 'N/A' }}</td>
          <td v-if="statusFilter === 'Reviewed'">{{ symptom.causes.join(', ') || 'N/A' }}</td>
          <td v-if="statusFilter === 'Reviewed'">{{ symptom.solutions.join(', ') || 'N/A' }}</td>

          <td>{{ symptom.status }}</td>
          <td>
            <!-- If the status is Pending, show the Review button -->
            <button v-if="symptom.status === 'Pending'" @click="editSymptom(symptom)">Review</button>

            <!-- If the status is Reviewed, show the Delete button with red color -->
            <button v-if="symptom.status === 'Reviewed'" @click="deleteSymptom(symptom._id)" class="delete-button">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for updating the symptom details -->
    <div v-if="editingSymptom" class="modal">
      <div class="modal-content">
        <h4>Update Symptom: {{ editingSymptom.name }}</h4>
        <input v-model="updatedSeverity" type="text" placeholder="Enter severity (Low, Moderate, Critical)" />
        <textarea v-model="updatedCauses" placeholder="Enter causes (comma separated)"></textarea>
        <textarea v-model="updatedSolutions" placeholder="Enter solutions (comma separated)"></textarea>
        <!-- No need for status dropdown, it auto-updates to "Reviewed" -->
        <button @click="updateSymptom">Submit</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pendingSymptoms: [], // Array to hold all symptoms (both Pending and Reviewed)
      filteredSymptoms: [], // Array to hold symptoms based on selected status
      editingSymptom: null, // The symptom currently being edited
      updatedSeverity: "",
      updatedCauses: "",
      updatedSolutions: "",
      statusFilter: "Pending", // Default filter status to Pending
    };
  },
  created() {
    this.fetchSymptoms(); // Fetch symptoms on component mount
  },
  methods: {
    // Fetch symptoms based on the selected status (Pending or Reviewed)
    async fetchSymptoms() {
      try {
        const response = await axios.get("/api/symptoms", { withCredentials: true });
        this.pendingSymptoms = response.data; // Store all symptoms
        this.filterSymptoms(); // Filter symptoms based on selected status
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    },

    // Filter symptoms based on the selected status (Pending or Reviewed)
    filterSymptoms() {
      this.filteredSymptoms = this.pendingSymptoms.filter(
        (symptom) => symptom.status === this.statusFilter
      );
    },

    // Open the edit modal for a specific symptom
    editSymptom(symptom) {
      this.editingSymptom = symptom;
      this.updatedSeverity = symptom.severity || "";
      this.updatedCauses = symptom.causes.join(", ") || "";
      this.updatedSolutions = symptom.solutions.join(", ") || "";
      // Automatically set the status to "Reviewed" when editing
    },

    // Update the symptom after editing
    async updateSymptom() {
      if (!this.updatedSeverity || !this.updatedCauses || !this.updatedSolutions) {
        return alert("All fields are required.");
      }

      try {
        const response = await axios.put(
          `/api/symptoms/${this.editingSymptom._id}`,
          {
            severity: this.updatedSeverity,
            causes: this.updatedCauses.split(",").map((cause) => cause.trim()),
            solutions: this.updatedSolutions.split(",").map((solution) => solution.trim()),
            status: "Reviewed", // Set status to Reviewed automatically
          },
          {
            withCredentials: true,
          }
        );

        // Update the symptom in the array and filter out the reviewed one
        const index = this.pendingSymptoms.findIndex(
          (symptom) => symptom._id === this.editingSymptom._id
        );

        if (index !== -1) {
          this.pendingSymptoms[index] = response.data; // Update the symptom in the list
        }

        this.filterSymptoms(); // Re-filter symptoms based on the selected status
        // Close the modal
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating symptom:", error);
        alert("Failed to update symptom.");
      }
    },

    // Close the edit modal without saving
    cancelEdit() {
      this.editingSymptom = null;
      this.updatedSeverity = "";
      this.updatedCauses = "";
      this.updatedSolutions = "";
    },

    // Delete the symptom from the database and remove it from the list
    async deleteSymptom(symptomId) {
      try {
        await axios.delete(`/api/symptoms/${symptomId}`, { withCredentials: true });
        // Remove the symptom from the list
        this.pendingSymptoms = this.pendingSymptoms.filter(
          (symptom) => symptom._id !== symptomId
        );
        this.filterSymptoms(); // Re-filter symptoms based on the selected status
      } catch (error) {
        console.error("Error deleting symptom:", error);
        alert("Failed to delete symptom.");
      }
    },
  },
};
</script>

<style scoped>
.admin-pending-symptoms {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-top: 30px;
}

.status-dropdown {
  width: 150px;
  padding: 5px;
  background-color: transparent;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 20px;
}

.symptom-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: left;
}

.symptom-table th,
.symptom-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.symptom-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.875rem;
}

button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: left;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

textarea,
input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #218838;
}
</style>