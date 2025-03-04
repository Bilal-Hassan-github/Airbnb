class ExpressError extends Error {
    constructor(statusCode, message = "Internal Server Error") {
        super(message);
        this.statusCode = statusCode || 500;
        
    }
}

module.exports = ExpressError;

