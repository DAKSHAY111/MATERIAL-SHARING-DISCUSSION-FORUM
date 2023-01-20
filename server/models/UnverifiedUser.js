const mongoose = require("mongoose");

const UnverifiedUserSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        unique: true,
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
    },

    token: {
        type: String,
        required: true,
    }
});
const UnverifiedUser = mongoose.model("UnverifiedUser", UnverifiedUserSchema);

module.exports = UnverifiedUser;