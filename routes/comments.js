const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { body, validationResult } = require('express-validator');

router.post('/',
    authenticate,
    [
      body('content').trim().isLength({ min: 5 }).withMessage('Content must be at least 5 characters long'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { user_id, post_id, content } = req.body;
      try {
        const newComment = await Comment.create(user_id, post_id, content);
        res.json(newComment.rows[0]);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

router.get('/',
    authenticate,
    async (req, res) => {
  try {
    const comments = await Comment.getAll();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/post/:postId', authenticate, async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.getByPostId(postId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id',
    authenticate,
    async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.getById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id',
    authorize(Comment.getById),
    [
      body('content').optional().trim().isLength({ min: 5 }).withMessage('Content must be at least 5 characters long'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { content } = req.body;
      try {
        const updatedComment = await Comment.update(id, content);
        if (updatedComment.rowCount === 0) {
          return res.status(404).json({ message: 'Comment not found' });
        }
        res.json();
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

router.delete('/:id',
    authenticate,
    authorize(Comment.getById),
    async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.delete(id);
    if (deletedComment.rowCount === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;