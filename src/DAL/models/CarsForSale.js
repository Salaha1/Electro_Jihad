const db = require('../config');

async function getAllCars() {
    const query = `SELECT id, brand, model, color, kilometers, engine, price, image FROM cars_for_sale`;
    const [rows] = await db.execute(query);
    return rows;
}

async function getCarDetailsById(carId) {
    const query = `SELECT * FROM cars_for_sale WHERE id = ?`;
    const [rows] = await db.execute(query, [carId]); // Use parameterized query for safety
    return rows.length > 0 ? rows[0] : null; // Return the car if found, otherwise null
}

async function insertCar(car) {
    const query = `
        INSERT INTO cars_for_sale (brand, model, color, kilometers, engine, price, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        car.brand,
        car.model,
        car.color,
        car.kilometers,
        car.engine,
        car.price,
        car.image, // Binary data for image
    ];

    const [result] = await db.execute(query, values);
    return result; // Return the result object
}

module.exports = { getAllCars, getCarDetailsById, insertCar };