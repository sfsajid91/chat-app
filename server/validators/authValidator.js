const { body } = require('express-validator');

const signupValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters')
        .isLength({ max: 15 })
        .withMessage('Name must be less than 15 characters')
        .escape()
        .trim(),
];

const loginValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
];

const forgotPassValidator = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
];

module.exports = { signupValidator, loginValidator, forgotPassValidator };
