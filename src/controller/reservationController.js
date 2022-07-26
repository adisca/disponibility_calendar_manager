/**
 * @swagger
 * tags:
 *      name: Reservation
 *      description: CRUD operations on reservations + Filtered search
 */

/**
 * @swagger
 * /reservation/add:
 *      post:
 *          summary: Tries add a new reservation
 *          tags: [Reservation]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Reservation"
 *                          example:
 *                              "date": "2000-12-10"
 *                              "hour": [0, 1, 11, 12, 13, 22, 23]
 *          responses:
 *              200:
 *                  description: Reservation added successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Success message
 *                              example: Successfully added reservation(s)
 *              400:
 *                  description: Failed to add reservation
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: ValidationError hour 24 is not a valid hour! Failed to add reservation
 *              401:
 *                  description: Unauthorized, bad token
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Incorrect Authorization Header. Required Bearer token.
 */

const reservationService = require("../service/reservationService.js");

module.exports = function (app) {
    app.post("/reservation/add", reservationService.addReservation);
}