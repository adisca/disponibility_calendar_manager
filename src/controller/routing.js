const tokenValidationMiddleware = require("../middleware/tokenValidationMiddleware");

module.exports = function (router) {

    LOG.info(__filename, "Middleware routing enabled");

    // Insert routing here, used login for testing
    // router.post("/login", tokenValidationMiddleware.userRoleWrapper);

}
