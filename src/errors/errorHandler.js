function errorHandler(error, req, res, next){
    //set defaults for the error message if error object is empty
    const { status = 500, message = "Something went wrong." } = error;
    res.status(status).json({ error: message });
}

module.exports = errorHandler;