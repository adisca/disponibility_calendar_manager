module.exports.createUser = function (user) {
    return new Promise((resolve, reject) => {
        user.save((err) => {
            if (err) {
                LOG.error(__filename, err, "Failed to create user");
                reject({ err: err, msg: "Failed to create user" });
                return;
            }

            LOG.info(__filename, "Created user successfully");
            resolve("Created user successfully");
        });
    });
}