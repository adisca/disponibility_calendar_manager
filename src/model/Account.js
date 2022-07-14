/** 
 * @swagger
 * components:
 *      schemas:
 *          Account:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *                  - name
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The auto-generated id of the account.
 *                  email:
 *                      type: string
 *                      description: The email of the account folder, functioning as credentials.
 *                  password:
 *                      type: string
 *                      description: The password. It will be hashed in the database
 *                  role:
 *                      type: string
 *                      description: The role of the account (eg. User, Admin)
 *                  name:
 *                      type: string
 *                      description: The name of the account holder.
 *                  address:
 *                      type: string
 *                      description: The address of the account holder
 *                  phoneNb:
 *                      type: string
 *                      desription: The phone number. Needs one of the formats "DDDD DDD DDD" or "+C DDD DDD DDD" (D - digit, C - country code with 1-3 digits)
 *              example:
 *                      email: "email@email.com"
 *                      password: "1234"
 *                      role: "USER_ROLE"
 *                      name: "Marco Polo"
 *                      address: "Romania, Cluj, Cluj-Napoca, Str. Dorobantilor"
 *                      phoneNb: "1234 123 123"
*/

const mongoose = require("mongoose");
const roleEnum = require("./enums/Role");
const encryptor = require("../service/security/encryptor");

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
        set: v => encryptor.hashPassword(v)
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
