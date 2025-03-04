// This is a general purpose error handler for the backend, 
// when the backend encounters errors this handler redirects to an error page where necessary next steps can be taken.

function errorHandler(err, req, res, next) {
    console.error("\n CAUGHT ERROR: ", err, "\n");
    // Send the error to the client so that error can be displayed on error page
    res.status(err.statusCode).json({  
        error: err.message || "Internal Server Error",
        statusCode: err.statusCode,
        user_role: req.user.type,
        url: req.url,
        timestamp: Date(Date.now()).toString(),
        componentStack: err.stack ? err.stack : undefined // Normally sending the stack trace to the frontend is not good practice
    });
}

module.exports = errorHandler;
 
