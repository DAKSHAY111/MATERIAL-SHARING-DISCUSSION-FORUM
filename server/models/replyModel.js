const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    reply: {
        type: String,
        required: [true, "Reply cannot be empty"],
    },
    replyToPost: {
        type: mongoose.Schema.ObjectId,
        ref: "doubt",
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
});

const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;