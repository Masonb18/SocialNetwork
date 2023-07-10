const express = require('express');
const router = express.Router();


const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createReaction,
    deleteReaction
  } = require('../controllers/postController');

router.get('/', getAllPosts);

router.get('/:id', getPostById);

router.post('/', createPost);

router.put('/:id', updatePost);

router.delete('/:id', deletePost);

router.post('/:postId/reactions', createReaction);

router.delete('/:postId/reactions/:reactionId', deleteReaction);

module.exports = router;
