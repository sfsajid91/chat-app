const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isLoggedIn = async (req, res, next) => {
    const token = req?.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'You are not logged in!',
        });
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decodedJwt) => {
            if (err) {
                return null;
            }
            return decodedJwt;
        }
    );

    if (!decoded) {
        return res.status(401).json({
            message: 'Invalid token!',
        });
    }

    const user = await User.findOne({ _id: decoded.id }).lean().exec();

    if (!user) {
        return res.status(401).json({
            message: 'Invalid token!',
        });
    }

    req.user = user;

    return next();
};

module.exports = { isLoggedIn };
