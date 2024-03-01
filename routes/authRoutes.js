// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');
const Joi = require('joi');

// Joi schemas for validation
const registerSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Register route
router.post('/register', validateRequest(registerSchema), authController.register);

// Login route
router.post('/login', validateRequest(loginSchema), authController.login);

// Current user profile route - protected

module.exports = router;
