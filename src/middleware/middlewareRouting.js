const tokenValidationMiddleware = require("./tokenValidationMiddleware");

module.exports = function (router) {
    LOG.info(__filename, "Middleware routing enabled");

    router.post("/reservation", tokenValidationMiddleware.userRoleWrapper);
    router.delete("/reservation", tokenValidationMiddleware.userRoleWrapper);
}
