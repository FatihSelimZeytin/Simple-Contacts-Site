const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Create user (called by your HTML)
router.post('/', async (req, res) => {
    try {
        const { username, email, plainPassword } = req.body;

        if (!username || !email || !plainPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // ✅ Hash the password
        const passwordHash = await bcrypt.hash(plainPassword, 10);

        // ✅ Save to DB
        const user = await User.create({ username, email, passwordHash });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
