const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    reply: {
        type: String,
        required: [true, "Reply cannot be empty"],
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