const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;