const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; // Replace with a secure key or use process.env.JWT_SECRET

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'Invalid token format' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // { id: user.id }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
    