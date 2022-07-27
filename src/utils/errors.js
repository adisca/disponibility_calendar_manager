module.exports.UnauthorizedError = class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

module.exports.ForbiddenError = class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
    }
}

module.exports.NotFoundError = class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

module.exports.InternalError = class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = "InternalError";
    }
}
