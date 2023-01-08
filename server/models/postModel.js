const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A post must have a title"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "A post must have a description"],
    trim: true,
  },

  media: {
    type: String,
    required: [true, "A photo/pdf type document is must required to create a post"],
    trim: true,
  },

  tags: {
    type: Array,
    default: [],
  },

  likes: {
    type: mongoose.Schema.ObjectId,
    ref: "Likes",
  },

  comments: {
    type: Array,
    default: [],
  },

});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;