const mongoose = require("mongoose")

const dbConnectionSuccessMsg = "Database connected successfully";

module.exports.connect = function (uri) {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri, (err) => {
            if (err)
                reject(err);

            resolve(dbConnectionSuccessMsg);
        });
    });
}
