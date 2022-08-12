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
 *                  id:
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
const validators = require("../utils/validators");

const schema = new mongoose.Schema({
    date: {
        type: String,
        required: [true, "Date is required"],
        validate: {
            validator: validators.dateValidator,
            message: props => `${props.value} is not a valid date!${"\n "}Note: only the format "YYYY-MM-DD" is accepted`
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

schema.index({ date: 1, accountId: 1 }, { unique: true });

// Prehook to ensure validations. It is programmer unfriendly and dosen't give the mongoose errors.
// But it reduces the db operations to 1, which might be worthy.
// [Note to self]: NEVER EVER EVER use => syntax for callbacks if you plan to use "this"
schema.pre("updateOne", function (next) {
    let options = this.getOptions();
    let filter = this.getFilter();

    // Should be expanded for when the validated fields are in the query (update) and not only the filter
    // But I will do that only if I need to, this gave me enough headaches already
    if (options.upsert === true && options.runValidators === true) {
        // Validate the required fields
        schema.requiredPaths().map(p => {
            if (!filter[p]) {
                return next(new Error(`Path ${p} is a required field`));
            }
        });
        // Validate the date
        if (!validators.dateValidator(filter["date"]))
            return next(new Error(`${filter["date"]} is not a valid date!${"\n "}Note: only the format "YYYY-MM-DD" is accepted`));
    }
    return next();
});

module.exports = mongoose.model("Reservation", schema);
