const router = require('express').Router();
const passport = require('passport');
const {
    login,
    register,
    googleController,
} = require('../controllers/authController');

// this controller is not used but it is using under the hood in passport.js
// eslint-disable-next-line no-unused-vars
const googleOauth = require('../controllers/passport');
const {
    signupValidator,
    loginValidator,
} = require('../validators/authValidator');

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google authentication callback route
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        // successRedirect: process.env.CLIENT_URL,
        // successRedirect: 'http://localhost:3000/login',
    }),
    googleController
);

router.post('/login', loginValidator, login);

router.post('/register', signupValidator, register);

module.exports = router;
