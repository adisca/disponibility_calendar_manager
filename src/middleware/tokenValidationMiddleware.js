const accountRoles = require("../model/enums/Role");
const auth = require("../service/security/auth");
const errorService = require("../service/errorService");
const { UnauthorizedError } = require("../utils/errors");

module.exports.userRoleWrapper = function (req, res, next) {
    middleware(req, res, next, [accountRoles.enum.USER_ROLE, accountRoles.enum.ADMIN_ROLE]);
}

module.exports.adminRoleWrapper = function (req, res, next) {
    middleware(req, res, next, [accountRoles.enum.ADMIN_ROLE]);
}

function middleware(req, res, next, roles = []) {
    let authHeader = req.headers["authorization"];

    try {
        if (authHeader) {
            let authHeaderSplit = String(authHeader).split(" ");
            if (!(authHeaderSplit.length < 2 || authHeaderSplit[0] != "Bearer")) {
                req.payload = auth.verify(authHeaderSplit[1], roles);
                LOG.info(__filename, "Token verified and accepted");
                next();
                return;
            }
        }
        throw new Error("Incorrect Authorization Header. Required: Bearer token.");
    }
    catch (err) {
        LOG.error(__filename, err, "Token validation failed");
        switch (err.name) {
            case "UnauthorizedError":
                errorService.error403(res, err);
                break;
            case "TokenExpiredError": // For adding refresh stuff
            default:
                errorService.error401(res, err);
                break;
        }
        return;
    }
}

module.exports.middleware = middleware;
