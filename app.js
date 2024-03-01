const express = require('express');
require('dotenv').config(); // To use environment variables from .env file
const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const followRoutes = require('./routes/followRoutes');

// Middleware to parse JSON request bodies
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/follow', followRoutes);

// Generic error handler - for unmatched routes or runtime errors
app.use((req, res, next) => {
    res.status(404).json({ message: "Sorry can't find that!" });
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
