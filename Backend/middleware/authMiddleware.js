const { admin } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token with Firebase Admin
        // const decodedToken = await admin.auth().verifyIdToken(token);
        // req.user = decodedToken;

        // MOCK FOR DEVELOPMENT WITHOUT FIREBASE CREDENTIALS
        req.user = { uid: "mock-user-id", email: "mock@example.com" };

        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = verifyToken;
