const { validationResult } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

/*
 * This will return all coversation of user
 * Route: /chat
 * Method: GET
 */
const getAllConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] },
        })
            .populate({
                path: 'lastMessage',
                select: 'message updatedAt',
            })
            .populate({
                path: 'participants',
                select: {
                    password: 0,
                    googleId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                },
            })
            .sort({
                updatedAt: -1,
            })
            .lean()
            .exec();

        res.status(201).json(conversations);
    } catch (error) {
        next(error);
    }
};

/*
 * This will return all messages of a conversation if there are no conversation then it will return 404
 * Route: /chat/:conversationId
 * Method: GET
 */
const getAllMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            return res.status(404).json({
                message: 'The URL you are looking for does not exist',
            });
        }

        const conversation = await Conversation.findOne({ _id: conversationId })
            .populate({
                path: 'lastMessage',
                select: 'message updatedAt',
            })
            .populate({
                path: 'participants',
                select: {
                    password: 0,
                    googleId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                },
            })
            .sort({
                updatedAt: -1,
            })
            .lean()
            .exec();
        if (!conversation) {
            return res.status(404).json({
                message: 'The URL you are looking for does not exist',
            });
        }

        // check if user is part of this conversation
        const isPartOfConversation = conversation.participants.some(
            (participant) =>
                participant._id.toString() === req.user._id.toString()
        );

        if (!isPartOfConversation) {
            return res.status(403).json({
                message: 'You are not allowed to view this conversation',
            });
        }

        const messages = await Message.find({
            conversationId,
        })
            .sort({
                updatedAt: -1,
            })
            .lean()
            .exec();

        return res.status(201).json({
            conversation,
            messages,
        });
    } catch (error) {
        return next(error);
    }
};

/*
 * This will send message to a conversation if there are no conversation then it will create a new conversation
 * Route: /chat
 * Method: POST
 */
const sendMessage = async (req, res, next) => {
    try {
        const { message, receiverEmail } = req.body;

        const errors = validationResult(req).formatWith(({ msg }) => msg);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.mapped(),
            });
        }

        if (req.user.email === receiverEmail) {
            return res.status(400).json({
                message: 'You cannot send message to yourself',
            });
        }

        const receiver = await User.findOne({
            email: receiverEmail,
        })
            .lean()
            .exec();

        if (!receiver) {
            return res.status(404).json({
                message: 'No user found with this email',
            });
        }

        const existingConversation = await Conversation.findOne({
            participants: {
                $all: [req.user._id, receiver._id],
            },
        })
            .lean()
            .exec();

        if (existingConversation) {
            const newMessage = new Message({
                conversationId: existingConversation._id,
                message,
                sender: req.user._id,
            });

            await newMessage.save();

            const updatedConversation = await Conversation.findByIdAndUpdate(
                existingConversation._id,
                {
                    lastMessage: newMessage._id,
                },
                {
                    new: true,
                }
            )
                .populate({
                    path: 'lastMessage',
                    select: {
                        message: 1,
                        updatedAt: 1,
                    },
                })
                .populate({
                    path: 'participants',
                    select: {
                        password: 0,
                        googleId: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                    },
                })
                .lean()
                .exec();

            // send message to receiver using socket
            global.io.emit('newMessage', {
                message: newMessage,
                conversation: updatedConversation,
            });

            return res.status(201).json({
                message: newMessage,
                conversation: updatedConversation,
            });
        }

        const newConversation = new Conversation({
            participants: [req.user._id, receiver._id],
        });

        const savedConversation = await newConversation.save();
        const newMessage = new Message({
            conversationId: savedConversation._id,
            message,
            sender: req.user._id,
        });

        await newMessage.save();

        const updatedConversation = await Conversation.findByIdAndUpdate(
            savedConversation._id,
            {
                lastMessage: newMessage._id,
            },
            {
                new: true,
            }
        )
            .populate({
                path: 'lastMessage',
                select: {
                    message: 1,
                    updatedAt: 1,
                },
            })
            .populate({
                path: 'participants',
                select: {
                    password: 0,
                    googleId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0,
                },
            })
            .lean()
            .exec();

        // send message to receiver using socket
        global.io.emit('newMessage', {
            message: newMessage,
            conversation: updatedConversation,
        });

        return res.status(201).json({
            message: newMessage,
            conversation: updatedConversation,
        });
    } catch (err) {
        return next(err);
    }
};

const searchUser = async (req, res, next) => {
    try {
        const { search } = req.query;
        // search user by name except current user
        const users = await User.find({
            $or: [
                {
                    name: { $regex: search, $options: 'i' },
                },
                { email: { $regex: search, $options: 'i' } },
            ],
            _id: { $ne: req.user._id },
        })
            .lean()
            .exec();

        return res.status(201).json(users);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getAllConversations,
    getAllMessages,
    sendMessage,
    searchUser,
};
