const RefreshToken = require("../model/RefreshToken");
const repo = require("../repo/refreshTokenRepo");
const validators = require("../utils/validators");
const auth = require("./security/auth");
const errorService = require("./errorService");
const encryptor = require("./security/encryptor");
const InternalError = require("../utils/errors").InternalError;

module.exports.generateNew = generateNew;
module.exports.refresh = function (req, res) {
    let refreshTokenJson = req.body;

    if (!validators.jsonFieldPresentWrapper(refreshTokenJson, ["token"], res, __filename))
        return;

    repo.searchAndDestroy(refreshTokenJson["token"])
        .then((boundAccount) => {
            generateNew(boundAccount.id)
                .then((newRefreshToken) => {
                    try {
                        const newAuthToken = auth.sign(boundAccount);

                        LOG.info(__filename, "Successfully used the old refresh token and generated a new one");
                        res.status(200).send({
                            refreshToken: newRefreshToken.token,
                            authToken: newAuthToken,
                            msg: "Successfully used the old refresh token and generated a new one"
                        });
                    }
                    catch (err) {
                        LOG.error(__filename, err, "Failed to generate new auth token");
                        errorService.error500(res, err, "Failed to generate new auth token");
                    }
                })
                .catch((err) => {
                    LOG.error(__filename, err, "Failed to generate new refresh token");
                    errorService.error500(res, err, "Failed to generate new refresh token");
                });
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to use the refresh token");
            errorService.error(res, err, "Failed to use the refresh token");
        });
}

/**
 * Generates and saves a new refresh token in the database.
 * It doesn't delete the older refresh tokens and it dosen't create a jwt bearer auth token.
 * 
 * @param {number} accountId Take a guess
 * @returns The refresh token, if it was successful, otherwise throws an error. To extract the actual token: result.token
 */
function generateNew(accountId) {

    return new Promise(async (resolve, reject) => {
        let token;

        try {
            token = encryptor.generateRandomString();
        } catch (err) {
            reject(err);
            return;
        }

        let refreshToken = new RefreshToken({
            token: token,
            accountId: accountId
        });

        let finalError = new InternalError("Undefined error");
        // Failsafe. Astronomically low chances, but a 500 is in order after that many collisions
        let i = 100;
        while (i > 0) {
            i--;
            await repo.addToken(refreshToken)
                .then(() => {
                    i = 0;
                    LOG.info(__filename, "Successfully created a new RefreshToken");
                    resolve(refreshToken);
                })
                .catch((err) => {
                    // Duplicate key error
                    if (err.name === "MongoServerError" && err.message.split(" ")[0] === "E11000" && i > 0) {
                        LOG.error(__filename, err, "Tries remaining: " + i.toString());
                        try {
                            refreshToken.token = encryptor.generateRandomString();
                        } catch (err) {
                            reject(err);
                            i = 0;
                            return;
                        }
                    }
                    else {
                        finalError = err;
                        LOG.error(__filename, err, "Failed to create RefreshToken");
                        i = 0;
                        reject(finalError);
                    }
                });
        }
    });
}
