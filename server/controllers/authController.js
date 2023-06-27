const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }

        // checking if user already exists
        const existingUser = await User.findOne({ email }).lean().exec();

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists!',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: 'Registration successful!',
        });
    } catch (err) {
        return next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }

        // checking if user exists
        const userExist = await User.findOne({ email }).lean().exec();

        if (!userExist) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        // checking if password is correct
        const passwordMatch = await bcrypt.compare(
            password,
            userExist.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Invalid email or password',
            });
        }

        // create a JWT token that is valid for 24 hour
        const token = jwt.sign(
            {
                id: userExist._id,
                email: userExist.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '24h',
            }
        );

        delete userExist.password;

        return res.status(200).json({
            message: 'User logged in successfully',
            accessToken: token,
            user: userExist,
        });
    } catch (err) {
        return next(err);
    }
};

const googleController = async (req, res, next) => {
    try {
        const { email, picture, name, sub } = req.user._json;

        const existingUser = await User.findOne({ email }).lean().exec();

        if (existingUser) {
            const token = jwt
                .sign(
                    {
                        id: existingUser._id,
                        email: existingUser.email,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h',
                    }
                )
                .toString()
                .split('.')
                .join('+');

            delete existingUser.password;

            const userToken = jwt
                .sign(
                    {
                        ...existingUser,
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h',
                    }
                )
                .toString()
                .split('.')
                .join('+');

            console.log(userToken);

            return res.redirect(
                `${process.env.CLIENT_URL}/login/${token}/${userToken}`
            );
        }

        const hashedId = await bcrypt.hash(req.user.id, 10);

        const newUser = await User.create({
            name,
            email,
            googleId: sub,
            picture,
            password: hashedId,
        });

        delete newUser._doc.password;

        const token = jwt
            .sign(
                {
                    id: newUser._doc._id,
                    email: newUser._doc.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            )
            .toString()
            .split('.')
            .join('+');

        const userToken = jwt
            .sign(
                {
                    ...newUser._doc,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            )
            .toString()
            .split('.')
            .join('+');

        return res.redirect(
            `${process.env.CLIENT_URL}/login/${token}/${userToken}`
        );
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    googleController,
    register,
    login,
};
