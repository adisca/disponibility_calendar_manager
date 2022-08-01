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
