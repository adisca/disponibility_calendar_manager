const logInService = require("../service/logInService");

module.exports = function (app) {
    app.post("/register", logInService.registerUser);
}