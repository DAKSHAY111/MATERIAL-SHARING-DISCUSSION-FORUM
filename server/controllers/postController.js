const catchAsync = require("./../utils/catchAsync");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Doubt = require("../models/doubtModel");
const Reply = require("../models/replyModel");

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
    user.materialCount += 1;
    await user.save();

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
  const { options, name } = req.body;
  const requestedUser = await User.findOne({ name: name });

  if(!requestedUser){
    res.status(404).json("User not found!");
    return;
  }

  switch (options) {
    case "recent_material":
      const posts = await Post.find({ creator: requestedUser?._id }).limit(10).sort({ createdAt: -1 });
      res.status(200).json(posts);
      break;

    case "recent_doubts":
      const doubts = await Doubt.find({ creator: requestedUser?._id }).limit(10).sort({ createdAt: -1 });
      res.status(200).json(doubts);
      break;

    case "recent_replies":
      const replies = await Reply.find({ creator: requestedUser?._id }).limit(10).sort({ createdAt: -1 });
      res.status(200).json(replies);
      break;
  }
});

exports.vote = catchAsync(async (req, res) => {
  const { postData, type, user } = req.body;
  try {
    const post = await Post.findById(postData._id);
    const owner = await User.findById(post.creator);

    if (type === "up") {
      if (post.upVotes.indexOf(user._id) === -1) {
        post.upVotes.push(user._id);
        owner.reputation += 1;
      } else{
        post.upVotes.splice(post.upVotes.indexOf(user._id), 1);
        owner.reputation -= 1;
      }

      if (post.downVotes.indexOf(user._id) !== -1) {
        post.downVotes.splice(post.downVotes.indexOf(user._id), 1);
        owner.reputation += 1;
      }
    }
    else {
      if (post.downVotes.indexOf(user._id) === -1){
        post.downVotes.push(user._id);
        owner.reputation -= 1;
      }else{
        post.downVotes.splice(post.downVotes.indexOf(user._id), 1);
        owner.reputation += 1;
      }

      if (post.upVotes.indexOf(user._id) !== -1){
        post.upVotes.splice(post.upVotes.indexOf(user._id), 1);
        owner.reputation -= 1;
      }
    }

    await post.save();
    await owner.save();

    res.status(200).json({ postData: post, ownerInfo: owner });
  } catch (err) {
    res.status(500).json("Error occurred while processing! Please try again!");
  }
});