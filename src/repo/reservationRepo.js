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
