const mongoose = require("mongoose");

const connectionString = process.env.MONGO_CONNECT;

mongoose.connect(connectionString)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("MongoDB connection error:", err));