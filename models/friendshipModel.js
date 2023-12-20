const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  // User initiating the friendship, referencing the 'User' model, must be present
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // User being befriended, referencing the 'User' model, must be present
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

// Creating the Friendship model using the schema
const Friendship = mongoose.model('Friendship', friendshipSchema);

// Exporting the Friendship model for use in other files
module.exports = Friendship;

