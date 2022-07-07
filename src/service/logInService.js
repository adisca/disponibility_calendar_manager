const roleEnum = require("../model/enums/Role");
const repo = require("../repo/logInRepo");
const Account = require("../model/Account");
const crypto = require("crypto");

function validatePassword(pass) {
    if (pass && pass !== "") {
        return true;
    }
    return false;
}

module.exports.registerUser = function (userJson) {
    return new Promise(async (resolve, reject) => {
        userJson["role"] = roleEnum.enum.USER_ROLE;

        if (validatePassword(userJson["password"])) {
            var hash = crypto.createHash("md5").update(userJson["password"]).digest("hex");
            userJson["password"] = hash;
        }
        else {
            LOG.error(__filename, new Error("Bad password"), "The password could not be hashed because it failed the validation");
            reject({ err: new Error("Bad password"), msg: "The password could not be hashed because it failed the validation" });
            return;
        }

        let user = new Account(userJson);
        repo.createUser(user)
            .then((msg) => {
                resolve(msg);
            })
            .catch((errWithMsg) => {
                reject(errWithMsg);
            });
    });
}