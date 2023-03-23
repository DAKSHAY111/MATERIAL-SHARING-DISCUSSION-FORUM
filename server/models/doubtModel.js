const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
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
    upVotes: {
        type: Number,
        default: 0,
    },
    downVotes: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }
});

const Doubt = mongoose.model("Doubt", doubtSchema);
module.exports = Doubt;