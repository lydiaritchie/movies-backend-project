function notFound(req, res, next) {
    next({ status: 405, message: `Path not found: ${req.originalUrl}`});
}

module.exports = notFound;