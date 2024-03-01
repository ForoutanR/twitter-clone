const express = require('express');
const router = express.Router();
const followController = require('../controllers/FollowsController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to follow a user
router.post('/follow', authMiddleware, followController.followUser);

// Route to unfollow a user
router.post('/unfollow', authMiddleware, followController.unfollowUser);

// Additional routes can be added for functionalities like listing followers/following

module.exports = router;
