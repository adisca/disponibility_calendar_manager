/**
 * @swagger
 * tags:
 *      name: Log In
 *      description: Sign up/in API
 */

/**
 * @swagger
 * /register:
 *      post:
 *          summary: Tries to create a new user account
 *          tags: [Log In]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/Account"
 *                          example:
 *                              email: "email@email.com"
 *                              password: "1234"
 *                              name: "Marco Polo"
 *                              address: "Romania, Cluj, Cluj-Napoca, Str. Dorobantilor"
 *                              phoneNb: "1234 123 123"
 *          responses:
 *              200:
 *                  description: User created successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Success message
 *                              example: User created successfully
 *              400:
 *                  description: Failed to create the user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: ValidationError email Email is required
 */

const logInService = require("../service/logInService");

module.exports = function (app) {
    app.post("/register", logInService.registerUser);
}