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
 *              201:
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
 * /reservation/interval:
 *      get:
 *          summary: Returns the reservations within the interval
 *          tags: [Reservation]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          example:
 *                              "startDate": "2000-12-10"
 *                              "endDate": "2000-12-11"
 *          responses:
 *              200:
 *                  description: Reservations returned successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                              example:
 *                                  [{
 *                                      date: "2000-12-10",
 *                                      reservedHours:
 *                                      [{
 *                                          hour: 11,
 *                                          accounts:
 *                                          [{
 *                                              "_id": "62cd4e1ef3c7229fcec60378",
 *                                              "email": "email@email.com",
 *                                              "role": "USER_ROLE",
 *                                              "name": "Marco Polo",
 *                                              "address": "Romania, Cluj, Cluj-Napoca, Str. Dorobantilor",
 *                                              "phoneNb": "1234 123 123"
 *                                          }]
 *                                      }]
 *                                  }]
 *                                  
 *              400:
 *                  description: Some kind of validation failed, like missing fields or invalid dates/interval
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Invalid interval Start date must be lower than end date
 *              401:
 *                  description: Unauthorized, bad token
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Incorrect Authorization Header. Required Bearer token.
 *              404:
 *                  description: No reservations found in the given interval
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: NotFoundError No reservations match the interval
 */

const reservationService = require("../service/reservationService.js");

module.exports = function (app) {
    app.post("/reservation/add", reservationService.addReservation);

    app.get("/reservation/interval", reservationService.getInterval);
}