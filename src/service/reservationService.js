const repo = require("../repo/reservationRepo");
const Reservation = require("../model/Reservation");
const errorService = require("./errorService");
const validators = require("../utils/validators");

module.exports.addReservation = function (req, res) {
    let reservationJson = req.body;

    if (!validators.jsonFieldPresentWrapper(reservationJson, ["date", "hour"], res, __filename))
        return;

    reservationJson["accountId"] = req.payload.id;

    let reservation = new Reservation(reservationJson);

    repo.addReservation(reservation)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to add reservation");
            errorService.error(res, err, "Failed to add reservation");
        });
}

module.exports.addReservationMany = function (req, res) {
    let reservationJsons = req.body;
    if (reservationJsons.length <= 0) {
        const err = new Error("Empty array");
        LOG.error(__filename, err);
        errorService.error(res, err, "Failed to add reservations");
        return;
    }

    if (!validators.jsonManyFieldPresentWrapper(reservationJsons, ["date", "hour"], res, __filename))
        return;

    let reservations = [];
    let dates = [];
    for (let json of reservationJsons) {
        json["accountId"] = req.payload.id;

        if (json.hour.length <= 0) {
            const err = new Error("Empty hour list");
            LOG.error(__filename, err);
            errorService.error(res, err, "Failed to add reservations");
            return;
        }
        if (dates.indexOf(json.date) >= 0) {
            const err = new Error("Duplicate dates");
            LOG.error(__filename, err);
            errorService.error(res, err, "Failed to add reservations");
            return;
        }

        dates.push(json.date);
        reservations.push(new Reservation(json));
    }

    repo.addReservationMany(reservations)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to add reservations");
            errorService.error(res, err, "Failed to add reservations");
        });
}
