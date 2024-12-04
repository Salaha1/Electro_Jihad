const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const auth = require('./BLL/routes/authRoutes'); 
const session = require('express-session');
const mongoose = require('mongoose');
const symptomRoutes = require('./BLL/routes/symptomRoutes');
const bookingRoutes = require('./BLL/routes/bookingRoutes');


// Configure session middleware
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Set to true for HTTPS in production
    httpOnly: true,
    maxAge: 3600000,  // 1 hour
  },
}));


// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Enable CORS and JSON parsing
app.use(cors({origin: 'http://localhost:8080', // Allow requests from your frontend URL
  credentials: true, 
 })
);

app.use(bodyParser.json());


// Serve static files from the Vue build
const vueAppPath = path.join(__dirname, 'PL', 'dist');
app.use(express.static(vueAppPath));

// Authentication routes
app.use('/api/auth', auth);  // Prefix your routes with /api/auth

mongoose.connect('mongodb+srv://salahatallah04:c2PESX3bc78a0DVN@cardiagnostics.pkjpl.mongodb.net/CarDiagnostics?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', symptomRoutes);
app.use('/api',bookingRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});