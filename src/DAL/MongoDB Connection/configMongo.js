const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://salahatallah04:c2PESX3bc78a0DVN@cardiagnostics.pkjpl.mongodb.net/CarDiagnostics?retryWrites=true&w=majority";

mongoose.connect(connectionString)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("MongoDB connection error:", err));