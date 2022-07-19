const reservationService = require("../service/reservationService.js");

module.exports = function (app) {
    app.post("/reservation/add", reservationService.addReservation);
}