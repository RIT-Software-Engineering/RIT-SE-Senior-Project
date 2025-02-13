// This is a general purpose error handler for the backend, 
// when the backend encounters errors this handler redirects to an error page where necessary next steps can be taken.

// TODO reroute to error page, display error message, link to github issues?
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).send("Internal Server Error");
}

module.exports = errorHandler;
