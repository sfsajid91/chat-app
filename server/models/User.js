const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
        },
        picture: {
            type: String,
        },
        avatarColor: {
            type: String,
            required: true,
        },
        activeStatus: {
            status: {
                type: Boolean,
                default: false,
                required: true,
            },
            lastSeen: {
                type: Date,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
