const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.post('/',
    authenticate,
    async (req, res) => {
  const { postId, content } = req.body;
  const user_id = req.user.id;
  try {
    const comment = await Comment.create(user_id, postId, content);
    res.json(comment.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/',
    authenticate,
    async (req, res) => {
  try {
    const comments = await Comment.getAll();
    res.json(comments.rows);
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
    if (comment.rows.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(comment.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id',
    authenticate,
    authorize(Comment.getById),
    async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updatedComment = await Comment.update(id, content);
    if (updatedComment.rowCount === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.json(updatedComment.rows[0]);
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