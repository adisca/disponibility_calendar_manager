/** 
 * @swagger
 * components:
 *      schemas:
 *          RefreshToken:
 *              type: object
 *              required:
 *                  - token
 *                  - accountId
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The auto-generated id of the reservation.
 *                  token:
 *                      type: string
 *                      description: The actual token
 *                  accountId:
 *                      type: integer
 *                      description: The id of the account of this refresh token
 *                  createdAt:
 *                      type: Date
 *                      description: The time it was created at. Should be changed from default only in special circumstances
 *              example:
 *                  token: "69db3499-3715-4c55-83d7-ba24a109aaa7"
 *                  accountId: 1
 *                  createdAt: 2022-07-27T12:56:59.024+0000
*/

const mongoose = require("mongoose");

const EXPIRES_IN = "1w";

const schema = new mongoose.Schema({
    token: {
        type: String,
        unique: [true, "RefreshToken must be unique"],
        required: [true, "RefreshToken is required"]
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "AccountId is required"]
    },
    // Use default. Don't set this manually, unless it is completely intentional and you know what you are doing.
    createdAt: {
        type: Date,
        expires: EXPIRES_IN,
        default: Date.now
    }
});

module.exports = mongoose.model("RefreshToken", schema);
