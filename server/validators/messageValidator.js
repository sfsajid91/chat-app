const { body } = require('express-validator');

const sendMessageValidator = [
    body('message')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Message is required.'),

    body('receiverEmail')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
];

module.exports = { sendMessageValidator };
