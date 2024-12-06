const express = require('express');
const router = express.Router();
const carDetails = require('../../DAL/models/CarsForSale');

router.get('/car-details/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        console.log('Car ID received:', carId); // Debug the ID

        const car = await carDetails.getCarDetailsById(carId); // Call the DAL function
        console.log('Car fetched from database:', car); // Debug the response

        if (car) {
            // Convert image to Base64
            car.image = car.image ? `data:image/jpeg;base64,${Buffer.from(car.image).toString('base64')}` : null;
            console.log('Formatted car data:', car); // Debug the final response
            res.status(200).json(car);
        } else {
            console.log('Car not found for ID:', carId);
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).json({ error: 'Failed to fetch car details' });
    }
});


module.exports = router;

