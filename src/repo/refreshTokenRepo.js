const RefreshToken = require("../model/RefreshToken");
const Account = require("../model/Account");
const NotFoundError = require("../utils/errors").NotFoundError;

module.exports.searchAndDestroy = function (token) {
    return new Promise((resolve, reject) => {

        RefreshToken.findOneAndDelete({ token: token }, (err, doc) => {
            if (err) {
                LOG.error(__filename, err);
                reject(err);
                return;
            }
            if (!doc) {
                const err = new NotFoundError("Refresh token not found");
                LOG.error(__filename, err);
                reject(err);
                return;
            }

            LOG.info(__filename, "Found and removed refresh token");

            Account.findById(doc.accountId, (err, hit) => {
                if (err) {
                    LOG.error(__filename, err);
                    reject(err);
                    return;
                }

                LOG.info(__filename, "Account bound to the refresh token was found");
                resolve(hit);
            });
        });
    })
}

module.exports.addToken = function (refreshToken) {
    return new Promise((resolve, reject) => {
        refreshToken.save()
            .then(() => {
                LOG.info(__filename, "Refresh token created successfully");
                resolve();
            })
            .catch((err) => {
                LOG.error(__filename, err);
                reject(err);
            });
    })
}
