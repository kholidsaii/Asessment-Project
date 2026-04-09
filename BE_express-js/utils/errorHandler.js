// utils/errorHandler.js
const errorHandler = (res, err, statusCode = 500, message = "Internal Server Error") => {
    return res.status(statusCode).json({
        success: false,
        message: message,
        error: err.message || err
    });
};

module.exports = errorHandler; 
