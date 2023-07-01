require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');

const app = express();
// creating a http server
const server = http.createServer(app);

const middlewares = require('./middlewares/middlewares');
const errors = require('./middlewares/errors');
const routes = require('./routes/routes');
const Conversation = require('./models/Conversation');

app.use(middlewares);
app.use('/api/v1', routes);
app.use(errors);

const PORT = process.env.PORT || 5000;

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

global.io = io;

io.on('connection', (socket) => {
    socket.on('joinRoom', (conversatioId) => {
        socket.join(conversatioId);
    });

    // listen for online status
    socket.on('online', async (userId) => {
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
    });

    socket.on('typing', (isTyping, conversationId) => {
        socket.to(conversationId).emit('typing', isTyping, conversationId);
    });

    socket.on('disconnect', async () => {
        const userId = socket.user._id;

        // try {
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
        // } catch (error) {
        //     console.error(error);
        // }
    });
});

// function for initializing the server
const startServer = async () => {
    try {
        console.log(chalk.yellow.inverse('Connecting to Database...'));

        await mongoose.connect(process.env.DB_URI);
        console.log(chalk.green.inverse('Database Connected...'));
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.log(chalk.red(err));
    }
};

startServer();

// app.listen(PORT, () => {
//     console.log(chalk.green.inverse(`Server is running on port ${PORT}`));
// });
