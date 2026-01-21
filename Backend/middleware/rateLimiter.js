const rateLimit = require('express-rate-limit');

// Rate limiter for item reporting (10 reports per hour per user)
const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { error: 'Too many reports. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.uid || req.ip, // Use user ID if authenticated, otherwise IP
});

// Rate limiter for claiming items (5 claims per hour per user)
const claimLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: { error: 'Too many claim requests. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.uid || req.ip,
});

module.exports = { reportLimiter, claimLimiter };
