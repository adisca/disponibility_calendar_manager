const roleEnum = require("../model/enums/Role");
const repo = require("../repo/logInRepo");
const Account = require("../model/Account");
const errorService = require("./errorService");
const auth = require("./security/auth");
const validators = require("../utils/validators");

function validatePassword(pass) {
    // Basic validations, not to be used in production
    if (pass && pass.length >= 3) {
        return true;
    }
    return false;
}

module.exports.registerUser = function (req, res) {
    let userJson = req.body;

    if (!validators.jsonFieldPresentWrapper(userJson, ["email", "password", "name"], res, __filename))
        return;

    userJson["role"] = roleEnum.enum.USER_ROLE;

    if (!validatePassword(userJson["password"])) {
        const err = new Error("Bad password");
        LOG.error(__filename, err, "The password could not be hashed because it failed the validation");
        errorService.error400(res, err, "The password could not be hashed because it failed the validation");
        return;
    }

    let user = new Account(userJson);

    repo.createUser(user)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to create User");
            errorService.error(res, err, "Failed to create User");
        });
}

module.exports.login = function (req, res) {
    let credentialsJson = req.body;

    if (!validators.jsonFieldPresentWrapper(credentialsJson, ["email", "password"], res, __filename))
        return;

    repo.verifyAccountLogin(credentialsJson)
        .then((account) => {
            const token = auth.sign(account);
            res.status(200).send({
                token: token,
                msg: "Log in successful"
            });
        })
        .catch((err) => {
            LOG.error(__filename, err, "Log in failed");
            errorService.error400(res, err, "Log in failed");
        });
}
