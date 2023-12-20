// Importing the mongoose library for MongoDB
const mongoose = require('mongoose');

// Regular expression and error message for email validation
const emailValidator = [
  /^\S+@\S+\.\S+$/,
  'Email address is not valid',
];

// Defining the user schema using mongoose
const userSchema = new mongoose.Schema({
  // Username field with String type, uniqueness, and trimming whitespace
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
  },
  // Email field with String type, uniqueness, trimming whitespace, and email validation
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: emailValidator,
  },
  // Password field with String type, required, and minimum length validation
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters long'],
  },
  // Array of thoughts with references to the 'Thought' model
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  // Array of friends with references to the 'User' model
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Creating a mongoose model named 'User' based on the user schema
const User = mongoose.model('User', userSchema);

// Exporting the 'User' model for use in other parts of the application
module.exports = User;
