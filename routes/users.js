const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
router.post('/', async (req, res) => {
  try {
    const { username, email, plainPassword } = req.body;

    if (!username || !email || !plainPassword) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;