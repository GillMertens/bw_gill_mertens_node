const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const isAdmin = require('../middleware/isAdmin');
const { body, validationResult } = require('express-validator');

router.post('/',
    authenticate,
    isAdmin,
    [
      body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
      body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
      body('first_name').trim().isAlpha().withMessage('First name should only contain letters'),
      body('last_name').trim().isAlpha().withMessage('Last name should only contain letters'),
      body('email').trim().isEmail().withMessage('Invalid email format'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password, first_name, last_name, email, role } = req.body;
      try {
        const newUser = await User.create(username, password, first_name, last_name, email, role);
        res.json(newUser.rows[0]);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

router.get('/',
    authenticate,
    async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id',
    authenticate,
    async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id',
    authenticate,
    authorize(User.getById),
    [
      body('username').optional().trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
      body('first_name').optional().trim().isAlpha().withMessage('First name should only contain letters'),
      body('last_name').optional().trim().isAlpha().withMessage('Last name should only contain letters'),
      body('email').optional().trim().isEmail().withMessage('Invalid email format'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { username, first_name, last_name, email } = req.body;
      try {
        const updatedUser = await User.update(id, username, first_name, last_name, email);
        if (updatedUser.rowCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json();
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

router.delete('/:id',
    authenticate,
    authorize(User.getById),
    async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.delete(id);
    if (deletedUser.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/register',
    [
      body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
      body('password').trim().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
      body('first_name').trim().isAlpha().withMessage('First name should only contain letters'),
      body('last_name').trim().isAlpha().withMessage('Last name should only contain letters'),
      body('email').trim().isEmail().withMessage('Invalid email format'),
    ],
    async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password, first_name, last_name, email } = req.body;
  try {
    const newUser = await User.create(username, password, first_name, last_name, email);
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login',
    [
      body('username').trim().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
    ],
    async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await User.getByUsername(username);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;