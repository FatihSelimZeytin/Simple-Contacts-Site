const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secretKey = 'your-secret-key'; // Replace with environment variable in production

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Email and password are required' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Compare plain text password (insecure for production)
        if (user.passwordHash !== password)
            return res.status(401).json({ error: 'Invalid credentials' });

        // Create JWT token
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '2h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
