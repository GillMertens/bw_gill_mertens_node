const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/',
    authenticate,
    async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id;
    try {
        const newPost = await Post.create(user_id, title, content);
        res.json(newPost.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/',
    authenticate,
    async (req, res) => {
  try {
    const posts = await Post.getAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/limit', async (req, res) => {
    const limit = Number(req.body.limit);
    const offset = Number(req.body.offset);
    try {
        const posts = await Post.getAllLimitOffset(limit, offset);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id',
    authenticate,
    async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.getById(id);
    if (post.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id',
    authenticate,
    authorize(Post.getById),
    async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedPost = await Post.update(id, title, content);
        if (updatedPost.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id',
    authenticate,
    authorize(Post.getById),
    async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.delete(id);
    if (deletedPost.rowCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;