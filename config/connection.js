// Import the Mongoose library
const mongoose = require('mongoose');

// Define the MongoDB connection URL
const mongoURI = 'mongodb://127.0.0.1:27017/social-network-api';

// Establish a connection to the MongoDB database
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connection to the database successful');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

// Export the Mongoose connection for use in other modules
module.exports = mongoose;
