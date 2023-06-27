const chalk = require('chalk');

const notFoundHandler = (_req, _res, next) => {
    const error = new Error('The URL you are looking for does not exist');
    error.status = 404;
    next(error);
};

const errorHandler = (error, _req, res, _next) => {
    console.log(chalk.red(error));
    const message = error.message ? error.message : 'Server Error Occurred';
    const status = error.status ? error.status : 500;

    res.status(status).json({
        error: message,
    });
};

const errors = [notFoundHandler, errorHandler];

module.exports = errors;
