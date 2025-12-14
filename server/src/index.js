const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');

const itineraryRoutes = require('./routes/itinerary.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Travel AI Backend is running 🚀' });
});

// Routes
app.use('/api/itinerary', itineraryRoutes);

// Global error handler (safety net)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log('======================================');
    console.log(`🚀 Travel AI Backend running on port ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log('======================================');
});
