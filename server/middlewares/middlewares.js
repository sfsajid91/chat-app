const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

// Custom headers
const headers = (req, res, next) => {
    res.header('X-Powered-By', 'NodeJS'); // X-Powered-By: NodeJS
    next();
};

const middlewares = [
    express.json(),
    morgan('dev'),
    cors(),
    headers,
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    }),
    passport.initialize(),
    passport.session(),
];

module.exports = middlewares;
