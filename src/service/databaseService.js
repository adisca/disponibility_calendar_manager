const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/dcm";

module.exports.connect = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri, (err) => {
            if (err) {
                LOG.error(__filename, err, "Database could not be started");
                reject(err);
                return;
            }

            LOG.info(__filename, "Database connected successfully");
            resolve();
        });
    });
}

module.exports.disconnect = function () {
    mongoose.disconnect();
}

mongoose.connection.on("error", (err) => {
    LOG.error(__filename, err, "Database error");
});

mongoose.connection.on("disconnected", () => {
    LOG.info(__filename, "Database disconnected");
});
