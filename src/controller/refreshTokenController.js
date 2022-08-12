/**
 * @swagger
 * tags:
 *      name: Security
 *      description: Token management
 */

/**
 * @swagger
 * /refreshToken:
 *      post:
 *          summary: Tries to provide a new authToken-refreshToken pair based on the provided refresh token
 *          tags: [Security]
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          example:
 *                              token: "ea51e7a0-6d38-4235-b898-8e57dbcc56"
 *          responses:
 *              200:
 *                  description: Refresh successfull. The given token has been consumed and a new pair has been minted and returned.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              example:
 *                                  refreshToken: 85581fa0-4c8e-4578-b536-b919f69482d3
 *                                  authToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2Q0ZTFlZjNjNzIyOWZjZWM2MDM3OCIsInJvbGUiOiJVU0VSX1JPTEUiLCJpYXQiOjE2NTg5MzA0NTUsImV4cCI6MTY1ODk3MzY1NX0.D12aaFTyksoDOpZQiDldKIJYBiLsYiSBYc81FOXyt18
 *                                  msg: Successfully used the old refresh token and generated a new one
 *              400:
 *                  description: The required fields (token) are missing
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: Error Required field token is missing in json
 *              404:
 *                  description: Failed to find and use the token as it is likely invalid.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: NotFoundError Refresh token not found
 *              500:
 *                  description: Failed to generate new tokens. Either a mismatch in data, or the storage for refresh tokens is getting full.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: Error message
 *                              example: MongoServerError E11000 RefreshToken must be unique
 */

const refreshTokenService = require("../service/refreshTokenService");

module.exports = function (app, _middlewareRouter) {
    app.post("/refreshToken", refreshTokenService.refresh);
}
