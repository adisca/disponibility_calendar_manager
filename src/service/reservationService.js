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
            res.status(201).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to add reservation");
            errorService.error(res, err, "Failed to add reservation");
        });
}

module.exports.addReservationMany = function (req, res) {
    let reservationJsons = req.body;

    if (!validators.jsonManyFieldPresentWrapper(reservationJsons, ["date", "hour"], res, __filename))
        return;

    for (let json of reservationJsons)
        json["accountId"] = req.payload.id;

    repo.addReservationMany(reservationJsons)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to add reservations");
            errorService.error(res, err, "Failed to add reservations");
        });
}

module.exports.getInterval = function (req, res) {
    let intervalJson = req.query;

    if (!validators.jsonQueryPresentWrapper(intervalJson, ["startDate", "endDate"], res, __filename))
        return;

    if (!validators.dateValidator(intervalJson.startDate) || !validators.dateValidator(intervalJson.endDate)) {
        const err = new Error("Invalid date");
        LOG.error(__filename, err, "Accepted formats: YYYY-MM-DD");
        errorService.error(res, err, "Accepted formats: YYYY-MM-DD");
        return;
    }
    if (new Date(intervalJson.startDate) > new Date(intervalJson.endDate)) {
        const err = new Error("Invalid interval");
        LOG.error(__filename, err, "Start date must be lower than end date");
        errorService.error(res, err, "Start date must be lower than end date");
        return;
    }

    repo.getInterval(intervalJson)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to fetch results");
            errorService.error(res, err, "Failed to fetch results");
        });
}

module.exports.deleteReservation = function (req, res) {
    let reservationJson = req.body;

    if (!validators.jsonFieldPresentWrapper(reservationJson, ["date", "hour"], res, __filename))
        return;

    if (!validators.dateValidator(reservationJson.date)) {
        const err = new Error("Invalid date");
        LOG.error(__filename, err, "Accepted formats: YYYY-MM-DD");
        errorService.error(res, err, "Accepted formats: YYYY-MM-DD");
        return;
    }

    reservationJson["accountId"] = req.payload.id;

    repo.deleteReservation(reservationJson)
        .then((msg) => {
            res.status(200).send(msg);
        })
        .catch((err) => {
            LOG.error(__filename, err, "Failed to remove reservation");
            errorService.error(res, err, "Failed to remove reservation");
        });
}
