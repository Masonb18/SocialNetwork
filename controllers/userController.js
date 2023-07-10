const User = require('../models/User');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate('friends');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while getting users.' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('friends');
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while getting the user.' });
    }
  },

  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists.' });
      }

      const user = new User({ username, email, password });
      await user.save();

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      user.username = username;
      user.email = email;
      user.password = password;
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Delete the user
      await user.remove();

      res.json({ message: 'User deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
  },

  addFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ error: 'Friend not found.' });
      }

      if (user.friends.includes(friendId)) {
        return res.status(400).json({ error: 'Friend already added.' });
      }

      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the friend.' });
    }
  },

  removeFriend: async (req, res) => {
    try {
      const { userId, friendId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ error: 'Friend not found in the friend list.' });
      }

      user.friends.pull(friendId);
      await user.save();

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while removing the friend.' });
    }
  }
};

module.exports = userController;
