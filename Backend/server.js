const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS - Support both local development and production
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://lost2found-frontend.vercel.app'
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded images
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Serve Static Frontend (Production)
const DIST_PATH = path.join(__dirname, '../frontend/dist');
app.use(express.static(DIST_PATH));

// Health Check
app.get('/health', (req, res) => {
    res.send('Lost2Found Backend is Running! 🚀');
});

// Routes
const itemsRoutes = require('./routes/itemsRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/items', itemsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// SPA Fallback - Send all other requests to index.html
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
});
