const encryptor = require("../service/security/encryptor");
const Account = require("../model/Account");
const NotFoundError = require("../utils/errors").NotFoundError;

module.exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        user.save()
            .then(() => {
                LOG.info(__filename, "User created successfully");
                resolve("User created successfully");
            })
            .catch((err) => {
                LOG.error(__filename, err);
                reject(err);
            });
    });
}

module.exports.verifyAccountLogin = function (credentials) {
    return new Promise((resolve, reject) => {
        Account.findOne({ "email": credentials.email })
            .then((result) => {
                if (!result) {
                    const err = new NotFoundError("Email not found");
                    LOG.error(__filename, err);
                    reject(err);
                    return;
                }
                if (result.password === encryptor.hashPassword(credentials.password)) {
                    LOG.info(__filename, "Log in successfull");
                    resolve(result);
                    return;
                }

                const err = new Error("Wrong password");
                LOG.error(__filename, err);
                reject(err);
            })
            .catch((err) => {
                LOG.error(__filename, err, "Could not find the account");
                reject(err);
            });

    });
}
