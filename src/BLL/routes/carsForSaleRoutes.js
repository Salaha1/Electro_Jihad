const express = require('express');
const router = express.Router();
const carQueries = require('../../DAL/models/CarsForSale');

const multer = require("multer");

const storage = multer.memoryStorage(); // Store images in memory for Base64 encoding
const upload = multer({ storage });

router.get('/cars-for-sale', async (req, res) => {
    try {
        const cars = await carQueries.getAllCars();

        // Map cars and encode images as Base64
        const formattedCars = cars.map(car => ({
            ...car,
            image: car.image ? `data:image/jpeg;base64,${Buffer.from(car.image).toString('base64')}` : null
        }));

        console.log('Formatted Cars:', formattedCars); // Debugging: Log the cars with images
        res.status(200).json(formattedCars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

router.post('/add-car', upload.array("images"), async (req, res) => {
    try {
        console.log("Received body:", req.body); // Logs the text fields
        console.log("Received files:", req.files); // Logs the uploaded files

        const car = req.body;

        // Convert the first image to Base64
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => file.buffer); // Keep binary data
            car.image = images[0]; // Use the first image for simplicity
        } else {
            car.image = null;
        }

        console.log("Final car object:", car); // Logs the complete car object

        const result = await carQueries.insertCar(car);

        res.status(201).json({
            message: "Car added successfully",
            carId: result.insertId,
        });
    } catch (error) {
        console.error("Error adding car:", error);
        res.status(500).json({ error: "Failed to add car" });
    }
});




module.exports = router;
