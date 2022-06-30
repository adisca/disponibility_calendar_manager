const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/dcm";

module.exports.connect = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri, (err) => {
            if (err) {
                // PLACEHOLDER_LOG; error
                console.log("Database could not be started");
                reject(err);
                return;
            }

            // PLACEHOLDER_LOG; success
            console.log("Database connected successfully");
            resolve();
        });
    });
}
