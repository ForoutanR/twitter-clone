const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/TweetController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to post a new tweet
router.post('/', authMiddleware, tweetController.postTweet);

// Route to get all tweets (or modify to suit your application's needs, like getting tweets for a specific user)
router.get('/', authMiddleware, tweetController.getTweets);

// Additional routes can be added here, such as deleting a tweet, updating a tweet, etc.

module.exports = router;
