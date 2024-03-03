const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors())



const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const followRoutes = require('./routes/followRoutes');

// Middleware to parse JSON request bodies
app.use(express.json());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/follow', followRoutes);

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
