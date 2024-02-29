const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('../models/db');

// Validation schemas
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.register = async (req, res) => {
    // Validate request data
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await sql`INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPassword}) RETURNING *`;
        res.status(201).json({ user: newUser[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    // Validate request data
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
        const user = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (user.length > 0) {
            const isValid = await bcrypt.compare(password, user[0].password);
            if (isValid) {
                const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};
