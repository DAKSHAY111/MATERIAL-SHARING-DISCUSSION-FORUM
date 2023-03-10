const catchAsync = require("./../utils/catchAsync");
const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = catchAsync(async (req, res) => {
  const { title, description, tags, media, user } = req.body;
  try {
    const newPost = await Post.create({
      title: title,
      description: description,
      tags: tags,
      creator: user._id,
      createdAt: Date.now(),
      media: media,
    });
    delete newPost._id;
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json("Couldn't create post!! Please try again!");
  }
});

exports.fetchAll = catchAsync(async (req, res) => {
  try {
    const allPosts = await Post.find({}).sort({ createdAt: -1 });
    const result = [];

    for (let i = 0; i < allPosts.length; ++i) {
      const owner = await User.findById(allPosts[i].creator, { _id: 0, password: 0, email: 0 });
      result.push({ postData: allPosts[i], ownerInfo: owner });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("Couldn't find posts!! Please refresh and try again!!");
  }
});

exports.fetchOptions = catchAsync(async (req, res) => {
  const { options, user } = req.body;
  switch (options) {
    case "recent_material":
      const posts = await Post.find({ creator: user._id }).limit(10).sort({ createdAt: -1 });
      res.status(200).json(posts);
      break;

    case "recent_doubts":
      res.status(200).json([]);
      break;

    case "recent_replies":
      res.status(200).json([]);
      break;
  }
});

exports.vote = catchAsync(async (req, res) => {
  const { postData, type, user } = req.body;
  try {
    const post = await Post.findById(postData._id);
    const owner = await User.findById(post.creator);

    if(type === "up"){
      if(post.downVotes.indexOf(user._id) !== -1)
        post.downVotes.splice(post.downVotes.indexOf(user._id), 1);

      if(post.upVotes.indexOf(user._id) === -1)
        post.upVotes.push(user._id);
      else
        post.upVotes.splice(post.upVotes.indexOf(user._id), 1);
    }
    else{
      if(post.upVotes.indexOf(user._id) !== -1)
        post.upVotes.splice(post.upVotes.indexOf(user._id), 1);
        
      if(post.downVotes.indexOf(user._id) === -1)
        post.downVotes.push(user._id);
      else
        post.downVotes.splice(post.downVotes.indexOf(user._id), 1);
    }
    
    await post.save();
    res.status(200).json({ postData: post, ownerInfo: owner });
  } catch (err) {
    res.status(500).json("Error occurred while processing! Please try again!");
  }
});