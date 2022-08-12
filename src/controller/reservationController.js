/**
 * @swagger
 * tags:
 *      name: Reservation
 *      description: CRUD operations on reservations + Filtered search
 */

/**
 * @swagger
 * /reservation:
 *      post:
 *          summary: Tries add a new reservation
 *          tags: [Reservation]
 *          security:
 *            - BearerAuth: []
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
 *      delete:
 *          summary: Tries to delete a reservation
 *          tags: [Reservation]
 *          security:
 *            - BearerAuth: []
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
 *                  description: Reservation deleted successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Success message
 *                              example: Successfully deleted reservation(s)
 *              400:
 *                  description: Failed to remove reservation. One of the validations was unfulfilled.
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
 *                  description: Could not find the date-user pair in the database
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: NotFoundError Failed to find a reservation with the given user and date
 */

/**
 * @swagger
 * /reservation/interval:
 *      get:
 *          summary: Returns the reservations within the interval
 *          tags: [Reservation]
 *          security:
 *            - BearerAuth: []
 *          parameters:
 *            - in: query
 *              name: startDate
 *              schema:
 *                  type: string
 *                  example: 2000-12-10
 *              description: The start date of the interval
 *            - in: query
 *              name: endDate
 *              schema:
 *                  type: string
 *                  example: 2000-12-12
 *              description: The end date of the interval
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
 * 
 */

/**
 * @swagger
 * /reservation/many:
 *      post:
 *          summary: Tries to add an array of reservations
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
 *                  description: Reservations added successfully
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

const reservationService = require("../service/reservationService.js");
const tokenValidationMiddleware = require("../middleware/tokenValidationMiddleware");

module.exports = function (app, middlewareRouter) {
    app.post("/reservation", reservationService.addReservation);
    app.get("/reservation/interval", reservationService.getInterval);
    app.delete("/reservation", reservationService.deleteReservation);
    app.post("/reservation/many", reservationService.addReservationMany);

    middlewareRouter.post("/reservation", tokenValidationMiddleware.userRoleWrapper);
    middlewareRouter.get("/reservation/interval", tokenValidationMiddleware.userRoleWrapper);
    middlewareRouter.delete("/reservation", tokenValidationMiddleware.userRoleWrapper);
    middlewareRouter.post("/reservation/many", tokenValidationMiddleware.userRoleWrapper);
}
