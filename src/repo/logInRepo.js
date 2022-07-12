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