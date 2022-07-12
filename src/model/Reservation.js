/** 
 * @swagger
 * components:
 *      schemas:
 *          Reservation:
 *              type: object
 *              required:
 *                  - date
 *                  - accountId
 *              properties:
 *                  _id:
 *                      type: integer
 *                      description: The auto-generated id of the reservation.
 *                  date:
 *                      type: string
 *                      description: The date of the reservation
 *                  accountId:
 *                      type: integer
 *                      description: The id of the account of this reservation
 *                  hour:
 *                      type: array
 *                      items:
 *                          type: integer
 *                          description: The hours reserved by this date-account pair
 *              example:
 *                  date: "2022-12-28"
 *                  accountId: 1
 *                  hour: [0, 1, 12, 13, 22, 23]
*/

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, "Date is required"],
        validate: {
            validator: function (v) {
                const d = new Date(v);
                return d instanceof Date && !isNaN(d) && v === d.toISOString().split("T")[0];
            },
            message: props => `${props.value} is not a valid date!
                Note: only the format "YYYY-MM-DD" is accepted`
        }
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "AccountId is required"]
    },
    // We will use set operations to ensure uniqueness
    hour: [{
        type: Number,
        validate: {
            validator: function (v) {
                return v >= 0 && v <= 23;
            },
            message: props => `${props.value} is not a valid hour!`
        }
    }]
});

schema.index({ date: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Reservation", schema);
