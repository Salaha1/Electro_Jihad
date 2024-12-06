const db = require('../config'); // Assuming this is the correct path to your database connection

async function getUserByEmail(email) {
  try {
    // Use query instead of execute
    const [rows] = await db.query('SELECT * FROM customer WHERE email = ?', [email]);
    return rows[0];  // Return the first row (user) or undefined if no user found
  } catch (err) {
    console.error('Error fetching user by email:', err.message);
    throw new Error('Database query error while fetching user by email');
  }
}

async function createUser(fname,lname,phone,email, password) {
  try {
    // Use query for inserting new user
    await db.query('INSERT INTO customer (  first_name,last_name, phone_number,email,user_password) VALUES (?, ?, ?, ?, ?)', [fname,lname,phone,email, password]);
  } catch (err) {
    console.error('Error creating user:', err.message);
    throw new Error('Database query error while creating user');
  }
}

module.exports = { getUserByEmail, createUser };