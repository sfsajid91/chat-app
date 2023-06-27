const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['email', 'profile'],
};

// Configure Passport middleware
passport.use(
    new GoogleStrategy(
        googleConfig,
        (accessToken, refreshToken, profile, done) => {
            // Implement Google authentication logic here
            // Check if the user already exists in the User collection
            // If yes, retrieve the user information
            // If no, create a new user record using the Google profile information
            // Return the user information to the callback function
            done(null, profile);
        }
    )
);

// Serialize the user object
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize the user object
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
