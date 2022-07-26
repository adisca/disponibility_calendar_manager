const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../../utils/errors").UnauthorizedError;

const TOKEN_KEY = process.env.TOKEN_KEY || "";

module.exports.sign = function (account) {
    if (!account || !account.id || !account.role) {
        const err = new Error("JWT incorrect input");
        LOG.error(__filename, err);
        throw err;
    }
    return jwt.sign(
        {
            id: account.id,
            role: account.role
        },
        TOKEN_KEY,
        {
            expiresIn: "12h"
        }
    );
}

module.exports.verify = function (token, roles = []) {
    try {
        const decoded = jwt.decode(token);
        var ok = false;

        if (roles.length === 0)
            ok = true;
        else
            if (roles.indexOf(decoded.role) !== -1)
                ok = true;

        if (ok) {
            jwt.verify(token, TOKEN_KEY);
            return decoded;
        }
        else {
            const err = new UnauthorizedError("Invalid role");
            LOG.error(__filename, err, "The owner of the token does not have the right role for this operation");
            throw err;
        }
    }
    catch (err) {
        LOG.error(__filename, err, "The token verification failed");
        throw err;
    }
}

// In case we will have special encryption and decryption
module.exports.decode = function (token) {
    return jwt.decode(token);
}
