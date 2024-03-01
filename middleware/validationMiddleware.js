// middleware/validationMiddleware.js
const Joi = require('joi');

// Function that returns middleware for route-specific validation
const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateRequest;
