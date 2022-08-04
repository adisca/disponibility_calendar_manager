const Reservation = require("../model/Reservation");

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

module.exports.addReservationMany = function (reservations) {
    return new Promise(async (resolve, reject) => {
        try {

            if (reservations.length <= 0)
                throw new Error("Empty array");

            let dates = [];
            let bulkOps = [];
            for (let reservation of reservations) {

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