// Importing the mongoose library
const mongoose = require('mongoose');

// Defining the schema for reactions
const reactionSchema = new mongoose.Schema({
  // Optional text associated with the reaction
  reactionText: {
    type: String
  },
  // User who made the reaction, referencing the 'User' model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Timestamp of the reaction, defaulting to the current date and time
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Creating the Reaction model using the schema
const Reaction = mongoose.model('Reaction', reactionSchema);

// Exporting the Reaction model for use in other files
module.exports = Reaction;
