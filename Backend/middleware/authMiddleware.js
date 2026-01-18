const { auth } = require('../firebase');

const verifyToken = async (req, res, next) => {
    console.log('🔐 verifyToken middleware hit');

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log('❌ No authorization header');
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        console.log('❌ No token in authorization header');
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        console.log('✅ Token verified for user:', decodedToken.uid);
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyToken;
