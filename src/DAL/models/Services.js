const mongoose = require('mongoose');

// Define the schema for a Service
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },         // Name of the service
 
});

// Create the Service model
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;