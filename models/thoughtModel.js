const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for individual reactions
const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: [true, 'Reaction body is required'],
    maxLength: [200, 'Reaction body should not exceed 200 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => new Date(timestamp).toISOString(),
  },
});

// Define the schema for individual thoughts
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: [true, 'Thought text is required'],
    maxLength: [200, 'Thought text should not exceed 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => new Date(timestamp).toISOString(),
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  reactions: [
    { type: Schema.Types.ObjectId, ref: 'Reaction' },
  ],
});

// Create virtual for reactionCount to dynamically calculate the number of reactions
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Create a model for thoughts based on the defined schema
const Thought = mongoose.model('Thought', thoughtSchema);

// Export the Thought model for use in other files
module.exports = Thought;
