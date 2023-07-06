require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const mongoose = require('mongoose');
const http = require('http');

const app = express();
// creating a http server
const server = http.createServer(app);

const middlewares = require('./middlewares/middlewares');
const errors = require('./middlewares/errors');
const routes = require('./routes/routes');
const configureSocket = require('./controllers/socketController');

app.use(middlewares);
app.use('/api/v1', routes);
app.use(errors);

const PORT = process.env.PORT || 5000;

const io = configureSocket(server);
global.io = io;

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
