const crypto = require("crypto");

module.exports.hashPassword = function (password) {
    return crypto.createHash("md5").update(password).digest("hex");
}

module.exports.generateRandomUUID = function () {
    return crypto.randomUUID();
}
