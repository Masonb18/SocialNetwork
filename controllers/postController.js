const User = require('../models/User');
const Post = require('../models/Post');

const postController = {
    getAllPosts: async (req, res) => {
      try {
        const posts = await Post.find().populate('author');
        res.json(posts);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting posts.' });
      }
    },
  
    getPostById: async (req, res) => {
      try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
        }
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while getting the post.' });
      }
    },
  
    createPost: async (req, res) => {
      try {
        const { userId, text } = req.body;
  
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found.' });
        }
  
        // Create the post
        const post = new Post({ text, author: userId });
        await post.save();
  
        // Update the user's posts array
        user.posts.push(post._id);
        await user.save();
  
        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the post.' });
      }
    },
  
    updatePost: async (req, res) => {
      try {
        const { text } = req.body;
        const postId = req.params.id;
  
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
        }
  
        post.text = text;
        await post.save();
  
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the post.' });
      }
    },
  
    deletePost: async (req, res) => {
      try {
        const postId = req.params.id;
  
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
        }
  
        // Delete the post
        await post.remove();
  
        // Update the user's posts array
        const user = await User.findById(post.author);
        user.posts.pull(postId);
        await user.save();
  
        res.json({ message: 'Post deleted successfully.' });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
      }
    },
  
    createReaction: async (req, res) => {
      try {
        const { postId, reaction } = req.body;
  
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
        }
  
        post.reactions.push(reaction);
        await post.save();
  
        res.status(201).json(post);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the reaction.' });
      }
    },
  
    deleteReaction: async (req, res) => {
      try {
        const { postId, reactionId } = req.params;
  
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ error: 'Post not found.' });
        }
  
        const reactionIndex = post.reactions.findIndex(
          (reaction) => reaction._id.toString() === reactionId
        );
  
        if (reactionIndex === -1) {
          return res.status(404).json({ error: 'Reaction not found.' });
        }
  
        post.reactions.splice(reactionIndex, 1);
        await post.save();
  
        res.json(post);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the reaction.' });
      }
    }
  };
  
  module.exports = postController;
