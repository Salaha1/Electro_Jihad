const express = require("express");
const router = express.Router();
const Symptom = require("../../DAL/models/Symptom"); // Adjust the path as needed
const { isAuthenticated, isAdmin } = require("../services/middleware/authMiddleware"); // Import the authentication and admin middleware

// Submit a new symptom request (for authenticated users only)
// Submit a new symptom request (for authenticated users only)
router.post("/symptoms/request", isAuthenticated, async (req, res) => {
    try {
        const { name, causes, severity } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Symptom name is required" });
        }

        // Create a new symptom entry with the status "Pending"
        const newSymptom = new Symptom({
            name,
            causes: causes || [],  // Default to an empty array
            solutions: [],  // Initially empty
            severity,
            status: "Pending",  // Pending approval by admin
        });

        const savedSymptom = await newSymptom.save();
        console.log('Saved Symptom:', savedSymptom);  // Log the saved symptom

        res.status(201).json(savedSymptom);
    } catch (err) {
        console.error("Error submitting symptom:", err);  // Log the error details
        res.status(500).json({ error: "Error submitting new symptom", details: err.message });
    }
});

// Fetch symptoms (public access), filtered by status
router.get("/symptoms", async (req, res) => {
    try {
        const statusFilter = req.query.status; // Get status filter from query parameter
        const symptoms = statusFilter
            ? await Symptom.find({ status: statusFilter }) // Filter by status if provided
            : await Symptom.find(); // Otherwise fetch all symptoms

        res.status(200).json(symptoms);
    } catch (err) {
        res.status(500).json({ error: "Error fetching symptoms", details: err });
    }
});
router.get("/symptoms/pending", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const symptoms = await Symptom.find({ status: "Pending" });
        res.status(200).json(symptoms);
    } catch (error) {
        console.error("Error fetching symptoms:", error);  // Log the error here
        res.status(500).json({ error: "Error fetching symptom details", details: error });
    }
});
// Fetch a specific symptom by ID (public access)
router.get("/symptoms/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const symptom = await Symptom.findById(id);

        if (!symptom) {
            return res.status(404).json({ error: "Symptom not found" });
        }

        res.status(200).json(symptom);
    } catch (err) {
        res.status(500).json({ error: "Error fetching symptom details", details: err });
    }
});

// Correct query for pending symptoms
// Fetch all pending symptoms (admin-only)


// Update a pending symptom (admin-only)
router.put("/symptoms/pending/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { causes, solutions, severity } = req.body;

        // Update symptom and mark as "Reviewed"
        const updatedSymptom = await Symptom.findByIdAndUpdate(
            id,
            { causes, solutions, severity, status: "Reviewed" },
            { new: true }
        );

        if (!updatedSymptom) {
            return res.status(404).json({ error: "Symptom not found" });
        }

        res.status(200).json(updatedSymptom);
    } catch (err) {
        res.status(500).json({ error: "Error updating symptom", details: err });
    }
});

// Update an existing symptom (admin-only)
router.put("/symptoms/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { causes, solutions, severity } = req.body;

        // Find and update the symptom
        const updatedSymptom = await Symptom.findByIdAndUpdate(
            id,
            { causes, solutions, severity, status: "Reviewed" },
            { new: true }
        );

        if (!updatedSymptom) {
            return res.status(404).json({ error: "Symptom not found" });
        }

        res.status(200).json(updatedSymptom);
    } catch (err) {
        res.status(500).json({ error: "Error updating symptom", details: err });
    }
});

// Delete a symptom (admin-only)
router.delete("/symptoms/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSymptom = await Symptom.findByIdAndDelete(id);

        if (!deletedSymptom) {
            return res.status(404).json({ error: "Symptom not found" });
        }

        res.status(200).json({ message: "Symptom deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting symptom", details: err });
    }
});

module.exports = router;