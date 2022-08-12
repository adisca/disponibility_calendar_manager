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

module.exports.deleteReservation = function (reservation) {
    return new Promise(async (resolve, reject) => {

        try {
            // Should validate reservation
            if (reservation.hour.length <= 0) {
                throw new Error("No hours to remove");
            }
            // Should validate reservation
            if (reservation.hour.length > 24) {
                throw new Error("Too many hours, please avoid invalid hours and duplicates");
            }
            // Validate the hours here
            for (let h of reservation.hour) {
                if (h < 0 || h > 23) {
                    throw new Error(`Invalid hour. ${h} is outside the possible interval`);
                }
            }
            // Validate date here with the validator from next update, otherwise it will become a mess

            let doc = await Reservation.findOneAndUpdate(
                {
                    date: reservation.date,
                    accountId: reservation.accountId
                },
                {
                    $pullAll: {
                        hour: reservation.hour
                    }
                },
                { new: true }
            );

            if (!doc) {
                throw new NotFoundError("Failed to find a reservation with the given user and date");
            }

            if (doc.hour.length <= 0) {
                await Reservation.deleteOne({ _id: doc._id });
                LOG.info(__filename, "Reservation document deleted since no hours were left");
            }

            LOG.info(__filename, "Successfully deleted reservations");
            resolve("Successfully deleted reservations");
        }
        catch (err) {
            LOG.error(__filename, err);
            reject(err);
        }
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

                LOG.info(__filename, "Fetched intervals successfully");
                resolve(doc);
            })
    });
}

module.exports.addReservationMany = function (reservations) {
    return new Promise(async (resolve, reject) => {
        try {

            if (reservations.length <= 0)
                throw new Error("Empty array");

            let dates = [];
            let bulkOps = [];
            for (let reservation of reservations) {
                // Validates date and hours
                await Reservation.validate(reservation);
                if (reservation.hour.length <= 0)
                    throw new Error("Empty hour list");
                if (dates.indexOf(reservation.date) >= 0)
                    throw new Error("Duplicate dates");
                dates.push(reservation.date);

                bulkOps.push({
                    updateOne: {
                        filter: {
                            accountId: reservation.accountId,
                            date: reservation.date
                        },
                        update: {
                            $addToSet: {
                                hour: {
                                    $each: reservation.hour
                                }
                            }
                        },
                        upsert: true
                    }
                });
            }
            await Reservation.bulkWrite(bulkOps);

            LOG.info(__filename, "Successfully added reservation(s)");
            resolve("Successfully added reservation(s)");
        }
        catch (err) {
            LOG.error(__filename, err);
            reject(err);
        }
    });
}

module.exports.deleteReservationMany = function (reservations) {
    return new Promise(async (resolve, reject) => {
        try {
            let bulkOps = [];
            let dates = [];
            for (let reservation of reservations) {
                // Should validate reservation
                if (reservation.hour.length <= 0) {
                    throw new Error("No hours to remove");
                }
                // Should validate reservation
                if (reservation.hour.length > 24) {
                    throw new Error("Too many hours, please avoid invalid hours and duplicates");
                }
                // Validate the hours here
                for (let h of reservation.hour) {
                    if (h < 0 || h > 23) {
                        throw new Error(`Invalid hour. ${h} is outside the possible interval`);
                    }
                }

                // Validate date here with the validator from next update, otherwise it will become a mess

                if (dates.indexOf(reservation.date) >= 0) {
                    const err = new Error("Duplicate dates");
                    LOG.error(__filename, err);
                    errorService.error(res, err, "Failed to remove reservations");
                    return;
                }

                dates.push(reservation.date);
                bulkOps.push({
                    updateOne: {
                        filter: {
                            date: reservation.date,
                            accountId: reservation.accountId
                        },
                        update: {
                            $pullAll: {
                                hour: reservation.hour
                            }
                        }
                    }
                });
            }
            bulkOps.push({
                deleteMany: {
                    filter: {
                        hour: []
                    }
                }
            });

            let bulkInfo = await Reservation.bulkWrite(bulkOps);

            if (bulkInfo.nMatched === 0)
                throw new NotFoundError("None of the dates were found");
            if (bulkInfo.nModified === 0)
                throw new NotFoundError(`Some dates were found (${bulkInfo.nMatched}/${reservations.length}), but no hours in those days matched the removal ones`);

            const msg = `Successfully deleted reservations from ${bulkInfo.nModified} days\n\tDays unchanged: ${bulkInfo.nMatched - bulkInfo.nModified}\n\tDays not found: ${reservations.length - bulkInfo.nMatched}\n\tDays removed: ${bulkInfo.nRemoved}`;
            LOG.info(__filename, msg);
            resolve(msg);
        }
        catch (err) {
            LOG.error(__filename, err);
            reject(err);
        }
    });
}
