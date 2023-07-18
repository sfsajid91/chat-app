const { body } = require('express-validator');

const sendMessageValidator = [
    body('message')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Message is required.'),

    body('receiverEmail')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address.'),
];

module.exports = { sendMessageValidator };
