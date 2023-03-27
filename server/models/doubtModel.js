const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
    doubtTitle: {
        type: String,
        required: [true, "Doubt cannot be empty"],
    },
    media: {
        type: Array,
        default: [],
    },
    description: {
        type: String,
        required: [true, "Description cannot be empty"],
    },
    tags: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    upVotes: {
        type: Array,
        default: [],
    },
    downVotes: {
        type: Array,
        default: [],
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    views: {
        type: Number,
        default: 0,
    },
});

const Doubt = mongoose.model("Doubt", doubtSchema);
module.exports = Doubt;