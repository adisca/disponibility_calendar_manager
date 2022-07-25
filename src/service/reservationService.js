const repo = require("../repo/reservationRepo");
const Reservation = require("../model/Reservation");
const errorService = require("./errorService");

module.exports.addReservation = function (req, res) {
    let reservationJson = req.body;

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
