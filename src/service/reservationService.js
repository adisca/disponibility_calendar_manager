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

module.exports.deleteReservationMany = function (req, res) {
    let reservationJsons = req.body;
    if (reservationJsons.length <= 0) {
        const err = new Error("Empty array");
        LOG.error(__filename, err);
        errorService.error(res, err, "Failed to remove reservations");
        return;
    }

    if (!validators.jsonManyFieldPresentWrapper(reservationJsons, ["date", "hour"], res, __filename))
        return;

    for (let json of reservationJsons)
        json.accountId = req.payload.id;

    repo.deleteReservationMany(reservationJsons)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to remove reservations");
            errorService.error(res, err, "Failed to remove reservations");
        });

}
