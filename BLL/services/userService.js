const { getUserByEmail, createUser } = require('../../DAL/models/Customers');
const axios = require('axios');
const { sendVerificationEmail } = require('../services/emailService');
const crypto = require('crypto');
const db = require('../../DAL/config');

// Function to verify reCAPTCHA
async function verifyRecaptcha(recaptchaResponse) {
  const secretKey = '6LfokpEqAAAAAK8YdKOR53FDTtXp6vZQ6bBTPOQO'; // Your secret key from Google reCAPTCHA
  const url = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: recaptchaResponse,
      },
    });

    return response.data.success;
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}

// Function to create a verification token
async function createVerificationToken(userId) {
  const token = crypto.randomBytes(20).toString('hex');
  // Store the token in the database associated with the user
  await db.execute('UPDATE customer SET verification_token = ? WHERE customer_id = ?', [token, userId]);
  return token;
}

async function signUp(req) {
  const { fname, lname, phone, email, password, recaptchaResponse } = req.body;

  // Check for missing fields
  if (!fname || !lname || !phone || !email || !password || !recaptchaResponse) {
    return { error: 'Empty fields are not allowed. Please fill empty field(s)' };
  }

  // Verify reCAPTCHA
  const isCaptchaValid = await verifyRecaptcha(recaptchaResponse);
  if (!isCaptchaValid) {
    return { error: 'reCAPTCHA verification failed. Please try again.' };
  }

  try {
    // Check if the email already exists
    const [existingUser] = await db.execute('SELECT * FROM customer WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return { error: 'Email already exists. Sign in instead!' };
    }

    // Insert user into the database
    const [result] = await db.execute(
      'INSERT INTO customer (first_name, last_name, phone_number, email, user_password) VALUES (?, ?, ?, ?, ?)',
      [fname, lname, phone, email, password]
    );

    // Generate a verification token and store it
    const token = await createVerificationToken(result.insertId);

    // Send the verification email with the token
    await sendVerificationEmail(email, token);

    console.log('User created with email:', email);
    return { success: true, message: 'Signed up successfully. Please check your email for verification.' };
  } catch (err) {
    console.error('Error during signup:', err);  // Log the actual database error
    return { error: 'Database query error during signup: ' + err.message };  // Return the specific error message
  }
}
async function signIn(req) {
  const { email, password } = req.body;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    const [rows] = await db.execute('SELECT * FROM customer WHERE email = ?', [email]);

    if (rows.length === 0) {
      return { error: 'User not found' };
    }

    const user = rows[0];

   

    if (password === user.user_password) {
      return { user, role: user.role }; // Include the role in the returned user object
    } else {
      return { error: 'Invalid credentials' };
    }
  } catch (err) {
    console.error(err);
    return { error: 'Database query error' };
  }
}

module.exports = { signIn, getUserByEmail, signUp };

