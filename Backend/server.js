const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow all origins (for hackathon simplicity)
app.use(express.json()); // Parse JSON bodies

// Health Check Route
app.get('/', (req, res) => {
    res.send('Lost2Found Backend is Running! 🚀');
});

// Routes
const itemsRoutes = require('./routes/itemsRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/items', itemsRoutes);
app.use('/api/ai', aiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
