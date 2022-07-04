const mongoose = require("mongoose");
const roleEnum = require("./enums/Role");

const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "Email must be unique"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: {
            values: roleEnum.getAll(),
            message: "{VALUE} is not a valid role"
        },
        default: roleEnum.getDefault()
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [30, "Name too long"]
    },
    address: {
        type: String,
        maxLength: [50, "Address too long"]
    },
    phoneNb: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\d{4}\s\d{3}\s\d{3}$|^[+]\d{1,3}\s\d{3}\s\d{3}\s\d{3}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!
                Note: only the formats "DDDD DDD DDD" or "+C DDD DDD DDD" are accepted (D is digit, C is country code with 1-3 digits)`
        }
    }
});

module.exports = mongoose.model("Account", schema);
