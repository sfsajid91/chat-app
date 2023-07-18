const { body } = require('express-validator');

const signupValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.'),

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
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.'),
];

const forgotPassValidator = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.'),
];

module.exports = { signupValidator, loginValidator, forgotPassValidator };
