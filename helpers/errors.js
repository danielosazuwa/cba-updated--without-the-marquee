const config = require('../config/config');
const ErrorHandler = require('./errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (config.node_env === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production Mode Error Handler
    if (config.node_env === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Handling Prisma NotFoundError
        if (err.code === 'P2025') {
            const message = `Resource not found. Invalid ID: ${err.meta?.target}`;
            error = new ErrorHandler(message, 404);
        }

        // Handling Prisma Unique Constraint Violation
        if (err.code === 'P2002') {
            const message = `Duplicate value entered for ${Object.keys(err.meta.target).join(', ')}.`;
            error = new ErrorHandler(message, 400);
        }

        // Handling Validation Errors
        if (err instanceof Prisma.PrismaClientValidationError) {
            const message = 'Validation failed. Check your input data.';
            error = new ErrorHandler(message, 400);
        }

        // Handling JWT Errors
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web token is invalid. Try again';
            error = new ErrorHandler(message, 401);
        }

        // Handling Expired JWT Token Errors
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web token is expired. Try Again!';
            error = new ErrorHandler(message, 401);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};