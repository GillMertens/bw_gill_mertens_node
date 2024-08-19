const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { body, validationResult } = require('express-validator');

router.post('/',
    authenticate,
    [
        body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
        body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { user_id, title, content } = req.body;
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

router.get('/search', async (req, res) => {
    const { title } = req.query;
    try {
        const posts = await Post.searchByTitle(title);
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
    authorize(Post.getById),
    [
        body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
        body('content').optional().trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const { title, content } = req.body;
        try {
            const updatedPost = await Post.update(id, title, content);
            if (updatedPost.rowCount === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json();
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