// Import required libraries and modules
const express = require('express');      
const mongoose = require('mongoose');      
const userRoutes = require('./routes/userRoutes');    
const thoughtRoutes = require('./routes/thoughtRoutes');  

// Create an Express application
const app = express();

// Define the port on which the server will listen
const PORT = process.env.PORT || 3001;

// Enable JSON parsing for incoming requests
app.use(express.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/social-network-api')
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

// Use user-specific API routes
app.use('/api/users', userRoutes);

// Use thought-specific API routes
app.use('/api/thoughts', thoughtRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
