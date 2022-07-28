// Automatic error handler that sends selects the appropriate status code
// Will be updated over time
module.exports.error = function (res, err, msg = null) {
    switch (err.name) {
        case "MongoServerError":
        case "ValidationError":
        case "Error":
            this.error400(res, err, msg);
            break;
        case "JsonWebTokenError":
        case "TokenExpiredError":
        case "UnauthorizedError":
            this.error401(res, err, msg);
            break;
        case "ForbiddenError":
            this.error403(res, err, msg);
            break;
        case "NotFoundError":
            this.error404(res, err, msg);
            break;
        case "InternalError":
        case "TypeError":
            this.error500(res, err, msg);
            break;
        default:
            LOG.warning(__filename, `New type of error found: ${err.name}\n`
                + "\tPlease update the error function or use a preset status code error function instead");
            this.error500(res, err, msg);
    }
}

module.exports.error400 = function (res, err, msg = null) {
    res.status(400).send(responseErrMsgPacker(err, msg));
}

module.exports.error401 = function (res, err, msg = null) {
    res.status(401).send(responseErrMsgPacker(err, msg));
}

module.exports.error403 = function (res, err, msg = null) {
    res.status(403).send(responseErrMsgPacker(err, msg));
}

module.exports.error404 = function (res, err, msg = null) {
    res.status(404).send(responseErrMsgPacker(err, msg));
}

module.exports.error500 = function (res, err, msg = null) {
    res.status(500).send(responseErrMsgPacker(err, msg));
}

function responseErrMsgPacker(err, msg) {
    return `${err}\n\t${msg ? `\n\t${msg}` : ""}`;
}
