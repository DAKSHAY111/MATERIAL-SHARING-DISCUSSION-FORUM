const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const cloudinary = require("cloudinary");

exports.createPost = catchAsync(async (req, res) => {
  const { title, content, tags, description, user, media } = req.body;

  const newPost = await Post.create({
    title: title,
    description: description,
    content: content,
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
