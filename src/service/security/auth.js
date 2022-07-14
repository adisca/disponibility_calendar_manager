const jwt = require("jsonwebtoken");

const TOKEN_KEY = "123456"

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
            return true;
        }
        else {
            LOG.error(__filename, new Error("Invalid role"), "The owner of the token does not have the right role for this operation");
            return false;
        }
    }
    catch (err) {
        LOG.error(__filename, err, "The token verification failed");
        return false;
    }
}

// In case we will have special encryption and decryption
module.exports.decode = function (token) {
    return jwt.decode(token);
}
