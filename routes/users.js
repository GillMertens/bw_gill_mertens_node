const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const { username, password, first_name, last_name, email, role } = req.body;
  try {
    const newUser = await User.create(username, password, first_name, last_name, email, role);
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

router.post('/register', async (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;
  try {
    const newUser = await User.create(username, password, first_name, last_name, email);
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.getByUsername(username);
    console.log(user);
    if (!user || !user.password) {
      console.log(user)
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;