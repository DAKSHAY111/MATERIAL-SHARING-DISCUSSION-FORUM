const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    doubt: {
        type: String,
        required: [true, "Doubt cannot be empty"],
    },
    media: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description cannot be empty"],
    },
    replies: {
        type: Array,
        default: [],
    },
    tags: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Doubt = mongoose.model("Doubt", doubtSchema);
module.exports = Doubt;