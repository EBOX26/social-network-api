// Import necessary modules
const express = require('express');
const router = express.Router();
const UserModel = require('../models/userModel');
const ThoughtModel = require('../models/thoughtModel');
const ReactionModel = require('../models/reactionModel');

// Function to handle errors and send error responses
const handleError = (res, error, status = 500, message = 'Internal server error') => {
  console.error(error);
  res.status(status).json({ errorMessage: message });
};

// Function to check if an item is not found and send a 404 response
const handleNotFound = (item, res, itemType = 'Item') => {
  if (!item) {
    res.status(404).json({ message: `${itemType} not found` });
    return true;
  }
  return false;
};

// Retrieve all thoughts
router.get('/', async (req, res) => {
  try {
    // Retrieve all thoughts
    const thoughts = await ThoughtModel.find();
    res.json(thoughts);
  } catch (error) {
    handleError(res, error);
  }
});

// Retrieve a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Retrieve a thought by its _id
    const thought = await ThoughtModel.findById(thoughtId);
    if (handleNotFound(thought, res, 'Thought')) return;
    res.json(thought);
  } catch (error) {
    handleError(res, error);
  }
});

// Create a new thought
router.post('/', async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    // Create a new thought and associate it with the user
    const thought = await ThoughtModel.create({ thoughtText, username, userId });

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    res.json(thought);
  } catch (error) {
    handleError(res, error);
  }
});

// Update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;
  const { thoughtText } = req.body;

  try {
    // Update a thought by its _id and return the updated thought
    const updatedThought = await ThoughtModel.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    );

    if (handleNotFound(updatedThought, res, 'Thought')) return;
    res.json(updatedThought);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE (delete thought)
router.delete('/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Delete a thought by ID
    const deletedThought = await ThoughtModel.findByIdAndDelete(thoughtId);
    if (handleNotFound(deletedThought, res, 'Thought')) return;

    // Remove the thought reference from the user's thoughts
    const user = await UserModel.findByIdAndUpdate(
      deletedThought.userId,
      { $pull: { thoughts: thoughtId } },
      { new: true }
    );

    res.json({ message: 'Thought deleted successfully', deletedThought });
  } catch (error) {
    handleError(res, error);
  }
});

// Create a new reaction for a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    // Find the user associated with the reaction using username
    const user = await UserModel.findOne({ username: req.body.username });

    if (handleNotFound(user, res, 'User')) return;

    // Create a new reaction and associate it with the thought
    const newReaction = new ReactionModel({
      user: user._id,
      reactionText: req.body.reactionText,
      timestamp: req.body.timestamp,
    });

    const thought = await ThoughtModel.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: newReaction } },
      { new: true }
    );

    if (handleNotFound(thought, res, 'Thought')) return;

    res.status(201).json(newReaction);
  } catch (error) {
    handleError(res, error);
  }
});


// Remove a reaction by its reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  const { thoughtId, reactionId } = req.params;

  try {
    // Remove a reaction from the thought's reactions list
    const thought = await ThoughtModel.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: reactionId } },
      { new: true }
    );

    if (handleNotFound(thought, res, 'Thought')) return;

    res.json({ message: 'Reaction removed successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// Export the router for use in other files
module.exports = router;
