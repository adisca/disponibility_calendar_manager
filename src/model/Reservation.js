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
        required: [true, "Account ID is required"]
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
