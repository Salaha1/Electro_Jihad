const express = require('express');
const router = express.Router();
const { signIn, signUp } = require('../services/userService');
const { isAuthenticated } = require('../services/middleware/authMiddleware');
const { verifyEmail } = require('../services/userService'); // Import verifyEmail function

// Check authentication route
router.get('/check', isAuthenticated, (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Assuming the user object contains the role info
  res.status(200).json({
    message: 'Authenticated',
    username: req.session.user.name,
    role: req.session.user.role,  // Add the user's role here
  });
});

// Sign In Route
router.post('/signin', async (req, res) => {
  const response = await signIn(req);  // Remove res from the signIn call
  console.log(response);
  if (response.error) {
    return res.status(401).json({ error: response.error });  // Return error if sign-in failed
  }

  // Save user and ensure 'name' is part of the session data
  req.session.user = {
    ...response.user,  // Copy all user properties
    name: `${response.user.first_name} ${response.user.last_name}`,  // Add a name property
  };

  res.status(200).json({ message: 'Signed in successfully', user: response.user });
});

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    // Call the signUp service
    const response = await signUp(req);

    if (response.error) {
      return res.status(400).json({ error: response.error }); // Handle errors
    }

    // Success response
    res.status(201).json({ message: response.message });
  } catch (error) {
    console.error('Unexpected error during sign-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Call the verifyEmail function to verify the token and update the user
    const response = await verifyEmail(token);

    if (response.error) {
      return res.status(400).json({ error: response.error }); // Token verification failed
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid', { path: '/' }); // Ensure cookie is cleared
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;