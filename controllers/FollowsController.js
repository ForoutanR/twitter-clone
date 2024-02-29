const Joi = require('joi');
const { sql } = require('../models/db'); // Adjust the path as necessary

// Joi schema for validating follow input
const followSchema = Joi.object({
    followerId: Joi.number().required(),
    followingId: Joi.number().required(),
});
exports.followUser = async (req, res) => {
    const { error, value } = followSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { followerId, followingId } = value;

    // Prevent users from following themselves
    if (followerId === followingId) {
        return res.status(400).json({ message: "Users cannot follow themselves" });
    }

    try {
        const result = await sql.query(
            'INSERT INTO Follows (FollowerID, FollowingID, FollowDate) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING RETURNING *;',
            [followerId, followingId]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({ message: "Already following this user" });
        }

        res.status(201).json({ message: "Followed successfully" });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ message: 'Failed to follow user' });
    }
};

exports.unfollowUser = async (req, res) => {
    const { error, value } = followSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { followerId, followingId } = value;

    try {
        const result = await sql.query(
            'DELETE FROM Follows WHERE FollowerID = $1 AND FollowingID = $2 RETURNING *;',
            [followerId, followingId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Follow relationship not found" });
        }

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ message: 'Failed to unfollow user' });
    }
};
