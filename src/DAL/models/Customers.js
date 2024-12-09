const db = require('../MySQL Connection/config'); // Assuming this is the correct path to your database connection

async function getUserByEmail(email) {
  try {
    // Query the customer table to fetch user details by email
    const query = 'SELECT * FROM customer WHERE email = ?';
    const [rows] = await db.execute(query, [email]);

    // If a user is found, return the first result
    if (rows.length > 0) {
      return rows[0]; // Return the user object
    } else {
      return null; // No user found
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error; // Re-throw error for higher-level handling
  }
}
async function getUserById(customer_id) {
  try {
    // Query the customer table to fetch user details by customer_id
    const query = 'SELECT * FROM customer WHERE customer_id = ?';
    const [rows] = await db.execute(query, [customer_id]);

    // If a user is found, return the first result
    if (rows.length > 0) {
      return rows[0]; // Return the user object
    } else {
      return null; // No user found
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error; // Re-throw error for higher-level handling
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

module.exports = {getUserById, getUserByEmail, createUser };