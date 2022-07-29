const Reservation = require("../model/Reservation");
const NotFoundError = require("../utils/errors").NotFoundError;

module.exports.addReservation = function (reservation) {
    return new Promise((resolve, reject) => {
        if (reservation.hour.length <= 0) {
            const err = new Error("Empty hour list");
            LOG.error(__filename, err);
            reject(err);
            return;
        }


        Reservation.updateOne(
            {
                date: reservation.date,
                accountId: reservation.accountId
            },
            {
                $addToSet: {
                    hour: {
                        $each: reservation.hour
                    }
                }
            },
            {
                runValidators: true,
                upsert: true
            })
            .then(() => {
                LOG.info(__filename, "Successfully added reservation(s)");
                resolve("Successfully added reservation(s)");
            })
            .catch((err) => {
                LOG.error(__filename, err);
                reject(err);
            });
    });
}

module.exports.getInterval = function (intervalJson) {

    return new Promise((resolve, reject) => {
        Reservation.aggregate(
            [
                { $match: { date: { $gte: intervalJson.startDate, $lte: intervalJson.endDate } } },
                // join
                {
                    $lookup: {
                        from: "accounts",
                        pipeline: [
                            { $project: { password: 0, __v: 0 } }
                        ],
                        localField: "accountId",
                        foreignField: "_id",
                        as: "account"
                    }
                },
                { $sort: { hour: 1 } },
                { $unwind: "$hour" },
                { $unwind: "$account" },
                {
                    $group: {
                        _id: { date: "$date", hour: "$hour" },
                        account: { $push: "$account" }
                    }
                },
                {
                    $group: {
                        _id: "$_id.date",
                        reservedHours: { $push: { hour: "$_id.hour", accounts: "$account" } }
                    }
                },
                { $sort: { _id: 1 } },
                // advanced sort
                {
                    $set: {
                        reservedHours: {
                            $function: {
                                body: function (hours) {
                                    hours.sort((a, b) => a.hour - b.hour);
                                    return hours;
                                },
                                args: ["$reservedHours"],
                                lang: "js"
                            }
                        }
                    }
                },
                { $project: { _id: 0, date: "$_id", reservedHours: 1 } }
            ],
            (err, doc) => {
                if (err) {
                    LOG.error(__filename, err, "Failed to fetch");
                    reject(err);
                    return;
                }

                if (doc.length <= 0) {
                    const err = new NotFoundError("No reservations match the interval");
                    LOG.error(__filename, err);
                    reject(err);
                    return;
                }

                resolve(doc);
            })
    });
}
