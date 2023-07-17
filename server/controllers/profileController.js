const bcrypt = require('bcrypt');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const updateName = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Name is required!',
            });
        }

        const { _id } = req.user;

        const user = await User.findOneAndUpdate(
            { _id },
            { name },
            { new: true }
        )
            .lean()
            .exec();
        delete user.password;

        const userConversations = await Conversation.find({
            participants: {
                $in: [_id],
            },
        })
            .select({
                _id: 1,
            })
            .lean()
            .exec();
        global.io.emit('userUpdate', user, userConversations);
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: 'Old password and new password are required!',
            });
        }

        const { _id, password } = req.user;

        const passwordMatch = await bcrypt.compare(oldPassword, password);

        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect!',
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { _id },
            { password: hashedPassword },
            { new: true }
        )
            .lean()
            .exec();
        delete user.password;
        return res.status(200).json(user);
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    updateName,
    updatePassword,
};
