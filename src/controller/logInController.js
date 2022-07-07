const logInService = require("../service/logInService");

module.exports = function (app) {
    app.post("/register", async (req, res) => {
        logInService.registerUser(req.body)
            .then((msg) => {
                res.status(200);
                res.send(msg);
            })
            .catch((errWithMsg) => {
                res.status(400);
                res.send(`${errWithMsg.err}\n\n${errWithMsg.msg}`);
            });
    });
}