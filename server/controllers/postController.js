const catchAsync = require("./../utils/catchAsync");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = catchAsync(async (req, res) => {
  const { title, description, tags, media, user } = req.body;
  const newPost = await Post.create({
    title: title,
    description: description,
    tags: tags,
    creator: user._id,
    createdAt: Date.now(),
    media: media,
  });
  
  res.status(201).json({
    status: "success",
    data: newPost,
  });
});
