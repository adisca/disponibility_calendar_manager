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
 *                          $ref: "#/components/schemas/Account"
 *                          example:
 *                              email: "email@email.com"
 *                              password: "1234"
 *                              name: "Marco Polo"
 *                              address: "Romania, Cluj, Cluj-Napoca, Str. Dorobantilor"
 *                              phoneNb: "1234 123 123"
 *          responses:
 *              201:
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

/**
 * @swagger
 * /login:
 *      post:
 *          summary: Tries to log in with the given credentials
 *          tags: [Log In]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          example:
 *                              email: "email@email.com"
 *                              password: "1234"
 *          responses:
 *              200:
 *                  description: Log in successfull. An authentication token, a refresh token and a message has been returned.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              example:
 *                                  authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2MmNkNGUxZWYzYzcyMjlmY2VjNjAzNzgiLCJyb2xlIjoiVVNFUl9ST0xFIiwiaWF0IjoxNjU3NzkxNTczLCJleHAiOjE2NTc4MzQ3NzN9.eLjk1k7AM2pEGIwjCQLERzGRtXvNUO3RWGAc9awMl3g"
 *                                  refreshToken: "405b840f-e907-4d4a-834b-832cc6ef6574"
 *                                  msg: "Log in successful"
 *              400:
 *                  description: Failed to log in. Credentials are wrong or missing.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Wrong password
 *              404:
 *                  description: Failed to log in. Email is not registered.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: NotFoundError Email not found
 */

const logInService = require("../service/logInService");

module.exports = function (app, _middlewareRouter) {
    app.post("/register", logInService.registerUser);

    app.post("/login", logInService.login);
}
