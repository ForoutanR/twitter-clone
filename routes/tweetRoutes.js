const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/TweetController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, tweetController.postTweet);

router.get('/', authMiddleware, tweetController.getTweets);

router.get('/:id', authMiddleware,tweetController.getTweetById)


module.exports = router;
