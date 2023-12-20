// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Thought = require('../models/thoughtModel');

// Function to handle errors and send error responses
const handleError = (res, error, status = 500, message = 'Server error') => {
  console.error(error);
  res.status(status).json({ error: message });
};

// Function to check if a user is not found and send a 404 response
const handleUserNotFound = (user, res, message = 'User not found') => {
  if (!user) {
    res.status(404).json({ message });
    return true;
  }
  return false;
};

// GET all users
router.get('/', async (req, res) => {
  try {
    // Retrieve all users with populated thoughts and friends fields
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Retrieve a user by ID with populated thoughts and friends fields
    const user = await User.findById(userId).populate('thoughts friends');
    if (handleUserNotFound(user, res)) return;
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
});

// PUT (update user)
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Update user by ID and return the updated user
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (handleUserNotFound(updatedUser, res)) return;
    res.json(updatedUser);
  } catch (error) {
    handleError(res, error);
  }
});

// Handler for creating a new user
const createUserHandler = async (req, res) => {
  try {
    // Create a new user and send the created user in the response
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    handleError(res, error);
  }
};

// POST (create user)
router.post('/', createUserHandler);

// POST (create 2nd user)
router.post('/second-user', createUserHandler);

// POST (create 3rd user)
router.post('/third-user', createUserHandler);

// POST (create thought)
router.post('/:userId/thoughts', async (req, res) => {
  const { userId } = req.params;

  try {
    // Retrieve user by ID
    const user = await User.findById(userId);
    if (handleUserNotFound(user, res)) return;

    // Create a new thought and associate it with the user
    const newThought = await Thought.create(req.body);
    user.thoughts.push(newThought._id);
    await user.save();

    res.status(201).json(newThought);
  } catch (error) {
    handleError(res, error);
  }
});

// POST (add friend)
router.post('/:userId/friends', async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;

  try {
    // Retrieve user by ID
    const user = await User.findById(userId);
    if (handleUserNotFound(user, res)) return;

    // Add a friend to the user's friends list
    user.friends.push(friendId);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE (remove friend)
router.delete('/:userId/friends/:friendId', async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    // Remove a friend from the user's friends list
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );

    if (handleUserNotFound(updatedUser, res)) return;
    res.json(updatedUser);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE (delete user)
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Delete a user by ID
    const deletedUser = await User.findByIdAndDelete(userId);
    if (handleUserNotFound(deletedUser, res)) return;

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    handleError(res, error);
  }
});

// Export the router for use in other files
module.exports = router;
