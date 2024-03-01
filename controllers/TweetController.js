const Joi = require('joi');
const {sql} = require("../models/db");

// Updated Joi validation schema for tweets
const tweetSchema = Joi.object({
    userId: Joi.number().required(),
    content: Joi.string().max(280).required(),
    imageUrl: Joi.string().uri().allow(null, '').optional(),
    parentTweetId: Joi.number().allow(null).optional() // Allow for null if it's not a reply
});

exports.postTweet = async (req, res) => {
    // Validate the request data against the schema
    const { error, value } = tweetSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { userId, content, imageUrl, parentTweetId } = value;

    try {
        const query = `
      INSERT INTO Tweets (UserID, Content, ImageURL, ParentTweetID)
      VALUES ($1, $2, $3, $4)
      RETURNING TweetID, UserID, Content, ImageURL, ParentTweetID, CreationDate;
    `;
        const params = [userId, content, imageUrl || null, parentTweetId || null];
        const result = await sql.query(query, params);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error posting tweet:', error);
        res.status(500).json({ message: 'Failed to post tweet' });
    }
};

exports.getTweets = async (req, res) => {
    try {
        // Sample SQL query to fetch all tweets, consider adding JOIN to fetch user details
        const query = `
            SELECT t.TweetID, t.UserID, u.Username, t.Content, t.ImageURL, t.ParentTweetID, t.CreationDate
            FROM Tweets t
            JOIN Users u ON t.UserID = u.UserID
            ORDER BY t.CreationDate DESC;
        `;
        const result = await sql.query(query);

        // Respond with the fetched tweets
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching tweets:', error);
        res.status(500).json({ message: 'Failed to fetch tweets' });
    }
};


