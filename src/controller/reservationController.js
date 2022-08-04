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
 *                  description: Failed to add reservation. One of the validations was unfulfilled.
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

/**
 * @swagger
 * /reservation/many:
 *      delete:
 *          summary: Tries to delete a reservation
 *          tags: [Reservation]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          example:
 *                              [{
 *                                  "date": "2000-12-10",
 *                                  "hour": [0, 1, 11, 12, 13, 22, 23]
 *                              }]
 *          responses:
 *              200:
 *                  description: Reservation(s) deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Success message
 *                              example: Successfully deleted reservations from 2 days Days unchanged 2 Days not found 1 Days removed 0
 *              400:
 *                  description: Failed to remove reservations. One of the validations was unfulfilled.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error No hours to remove
 *              401:
 *                  description: Unauthorized, bad token
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Incorrect Authorization Header. Required Bearer token.
 *              404:
 *                  description: Could not find any reservation to remove
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: NotFoundError Some dates were found (1/3), but no hours in those days matched the removal ones
 */

const reservationService = require("../service/reservationService.js");

module.exports = function (app) {
    app.post("/reservation/add", reservationService.addReservation);

    app.delete("/reservation/many", reservationService.deleteReservationMany);
}