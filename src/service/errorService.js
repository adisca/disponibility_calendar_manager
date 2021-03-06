// Automatic error handler that sends selects the appropriate status code
// Will be updated over time
module.exports.error = function (res, err, msg = null) {
    switch (err.name) {
        case "MongoServerError":
        case "ValidationError":
        case "Error":
            this.error400(res, err, msg);
            break;
        case "TypeError":
            this.error500(res, err, msg);
        default:
            LOG.warning(__filename, `New type of error found: ${err.name}\n`
                + "\tPlease update the error function or use a preset status code error function instead");
            this.error500(res, err, msg);
    }
}

module.exports.error400 = function (res, err, msg = null) {
    res.status(400).send(`${err}\n\t${msg ? `\n\t${msg}` : ""}`);
}

module.exports.error500 = function (res, err, msg = null) {
    res.status(500).send(`${err}\n\t${msg ? `\n\t${msg}` : ""}`);
}