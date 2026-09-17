const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let isOperational = err.isOperational || false;

    // 1. Invalid ObjectId
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        isOperational = true;
    }

    // 2. Duplicate Object
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate field value: ${JSON.stringify(err.keyValue)}.`;
        isOperational = true;
    }

    // 3. Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(el => el.message).join('. ');
        isOperational = true;
    }

    // 4. JWT Error
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
        isOperational = true;
    }

    // 5. JWT Expired
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Session expired. Please log in again.';
        isOperational = true;
    }

    // 6. Syntax Error
    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
        isOperational = true;
    }

    // Others
    if (isOperational) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }

    // System Errors
    console.error('System error', err);
    return res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
    });
}

export default errorMiddleware;