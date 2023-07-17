const { Server } = require('socket.io');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        },
    });

    io.on('connection', (socket) => {
        socket.on('joinRoom', (conversatioId) => {
            socket.join(conversatioId);
        });

        // listen for online status
        socket.on('online', async (userId) => {
            if (!userId) return;
            try {
                const user = await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        activeStatus: {
                            status: true,
                        },
                    },
                    {
                        new: true,
                    }
                )
                    .lean()
                    .exec();

                delete user.password;

                const userConversations = await Conversation.find({
                    participants: {
                        $in: [userId],
                    },
                })
                    .select({
                        _id: 1,
                    })
                    .lean()
                    .exec();

                socket.user = user;

                socket.broadcast.emit('userUpdate', user, userConversations);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('typing', (isTyping, conversationId) => {
            socket.to(conversationId).emit('typing', isTyping, conversationId);
        });

        socket.on('disconnect', async () => {
            const userId = socket.user?._id;

            if (!userId) return;

            try {
                //     // Update activeStatus to false and set lastSeen to current time
                const user = await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        activeStatus: {
                            status: false,
                            lastSeen: new Date(),
                        },
                    },
                    {
                        new: true,
                    }
                )
                    .lean()
                    .exec();

                delete user.password;

                const userConversations = await Conversation.find({
                    participants: {
                        $in: [userId],
                    },
                })
                    .select({
                        _id: 1,
                    })
                    .lean()
                    .exec();

                // Emit the updated user data to other clients if needed
                socket.broadcast.emit('userUpdate', user, userConversations);
            } catch (error) {
                console.error(error);
            }
        });
    });

    return io;
};

module.exports = configureSocket;
