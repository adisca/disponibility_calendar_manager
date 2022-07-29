const tokenValidationMiddleware = require("./tokenValidationMiddleware");

module.exports = function (router) {
    LOG.info(__filename, "Middleware routing enabled");

    router.post("/reservation/add", tokenValidationMiddleware.userRoleWrapper);
    router.get("/reservation/interval", tokenValidationMiddleware.userRoleWrapper);
}
