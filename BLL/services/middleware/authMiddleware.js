function isAuthenticated(req, res, next) {
  console.log('Session in isAuthenticated:', req.session); // Debugging session
  if (req.session && req.session.user) {
    req.user = req.session.user; // Set req.user from the session
    return next(); // Proceed to the next route handler
  } else {
    return res.status(401).json({ message: 'Unauthorized' }); // Unauthorized response
  }
}
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next(); // Allow access to the admin route
  } else {
    return res.status(403).json({ error: 'Forbidden: Admins only' }); // Forbidden error for non-admin users
  }
}
  module.exports = { isAuthenticated , isAdmin};