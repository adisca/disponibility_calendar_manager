const mongoose = require("mongoose");
const roleEnum = require("./enums/Role");
const crypto = require("crypto");

const MAX_LENGTH_NAME = 30;
const MAX_LENGTH_ADDRESS = 50;

const schema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, "Email must be unique"],
        required: [true, "Email is required"],
        set: v => v.toLowerCase()
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        set: v => crypto.createHash("md5").update(v).digest("hex")
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
        maxLength: [MAX_LENGTH_NAME, `Name too long, max characters: ${MAX_LENGTH_NAME}`]
    },
    address: {
        type: String,
        maxLength: [MAX_LENGTH_ADDRESS, `Address too long, max characters: ${MAX_LENGTH_ADDRESS}`]
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
