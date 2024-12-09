const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    causes: [String], // List of causes
    solutions: [String], // List of solutions
    severity: { type: String, required: false },
    status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Symptom', symptomSchema);