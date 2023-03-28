const catchAsync = require("../utils/catchAsync");
const Doubt = require("../models/doubtModel");
const User = require("../models/userModel");
const Reply = require("../models/replyModel");

exports.createDoubt = catchAsync(async (req, res) => {

  const { doubtTitle, description, tags, media, user, update, id } = req.body;
  try {
    if (update) {
      const response = await Doubt.updateOne({ _id: id }, { $set: {
        doubtTitle: doubtTitle,
        description: description,
        tags: tags,
        media: media,
      }});
      res.status(200).json(response);
    } else {
      const newDoubt = await Doubt.create({
        doubtTitle: doubtTitle,
        description: description,
        tags: tags,
        creator: user._id,
        createdAt: Date.now(),
        media: media,
      });

      const owner = await User.findById(user._id);
      owner.doubtsCount += 1;
      await owner.save();

      res.status(201).json(newDoubt);
    }
  } catch (err) {
    res.status(500).json("Couldn't create doubt!! Please try again!");
  }
}
);

exports.deleteDoubt = catchAsync(async (req, res) => {
  const { doubt, user } = req.body;
  try {
    const _doubt = await Doubt.findById(doubt?._id);
    const _owner = await User.findById(_doubt?.creator);

    if (_doubt.creator?.toString() !== user?._id?.toString()) {
      res.status(400).json("You are not allowed to delete this post!");
      return;
    }

    _owner.doubtsCount -= 1;
    _owner.save();

    await Reply.deleteMany({ replyToPost: doubt?._id });
    const deletedDoubt = await Doubt.findByIdAndDelete(doubt?._id);
    res.status(201).json(deletedDoubt);
  } catch (err) {
    res.status(500).json("Couldn't delete doubt!! Please try again!");
  }
});


exports.addReply = catchAsync(async (req, res) => {
  const { doubt, user, reply } = req.body;
  try {
    const _doubt = await Doubt.findById(doubt._id);
    const newReply = await Reply.create({
      creator: user._id,
      reply: reply,
      replyToPost: _doubt._id,
      createdAt: Date.now(),
    });
    newReply.save();

    const _user = await User.findById(user._id);
    _user.repliesCount += 1;
    _user.save();

    const replies = await Reply.find({ replyToPost: _doubt._id }).sort({ createdAt: -1 });

    const replyInfo = [];
    for (const reply of replies)
      replyInfo.push({ replyData: reply, ownerInfo: await User.findById(reply.creator) });

    res.status(201).json({
      doubtData: _doubt, ownerInfo: user, replies: replyInfo
    });
  } catch (err) {
    res.status(500).json("Couldn't add reply!! Please try again!");
  }
});


exports.vote = catchAsync(async (req, res) => {
  const { doubtData, user, type } = req.body;

  try {
    const doubt = await Doubt.findById(doubtData._id);
    const owner = await User.findById(doubt.creator);

    if (type === "up") {
      if (doubt.downVotes.indexOf(user._id) !== -1)
        doubt.downVotes.splice(doubt.downVotes.indexOf(user._id), 1);

      if (doubt.upVotes.indexOf(user._id) === -1)
        doubt.upVotes.push(user._id);
      else
        doubt.upVotes.splice(doubt.upVotes.indexOf(user._id), 1);
    }
    else {
      if (doubt.upVotes.indexOf(user._id) !== -1)
        doubt.upVotes.splice(doubt.upVotes.indexOf(user._id), 1);

      if (doubt.downVotes.indexOf(user._id) === -1)
        doubt.downVotes.push(user._id);
      else
        doubt.downVotes.splice(doubt.downVotes.indexOf(user._id), 1);
    }

    await doubt.save();

    const replyInfo = [];

    const replies = await Reply.find({ replyToPost: doubt._id }).sort({ createdAt: -1 });
    for (const reply of replies)
      replyInfo.push({ replyData: reply, ownerInfo: await User.findById(reply.creator) });

    res.status(200).json({ doubtData: doubt, ownerInfo: owner, replies: replyInfo });
  } catch (err) {
    res.status(500).json("Error occurred while processing! Please try again!");
  }
});

exports.fetchAll = catchAsync(async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    const response = [];

    for (const doubt of doubts) {
      const userDetails = await User.findById(doubt?.creator);
      const reqInfo = new Object({
        name: userDetails?.name,
        photo: userDetails?.photo,
        reputation: userDetails?.reputation
      });
      response.push({ doubtDetails: doubt, ownerInfo: reqInfo });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Error occurred while processing! Please try again!");
  }
});

exports.fetchSingleDoubt = catchAsync(async (req, res) => {
  const { id } = req.body;
  try {
    const doubt = await Doubt.findById(id);
    doubt.views += 1;

    doubt.save();

    const doubtReplies = await Reply.find({ replyToPost: doubt._id }).sort({ createdAt: -1 });
    const replyInfo = [];

    for (const reply of doubtReplies)
      replyInfo.push({ replyData: reply, ownerInfo: await User.findById(reply.creator) });

    const owner = await User.findById(doubt.creator);
    res.status(200).json({ doubtData: doubt, ownerInfo: owner, replies: replyInfo });
  } catch (err) {
    req.status(500).json("Internal server error! Please try again!");
  }
});

exports.voteToReply = catchAsync(async (req, res) => {
  const { doubt, reply, type, user } = req.body;
  try {
    const doubtData = doubt?.doubtData;
    const doubtOwner = doubt?.ownerInfo;

    const _reply = await Reply.findById(reply?._id);
    if (type === "up") {
      const dIdx = _reply.downVotes.indexOf(user?._id);
      if (dIdx !== -1)
        _reply.downVotes.splice(dIdx, 1);

      const uIdx = _reply.upVotes.indexOf(user?._id);
      if (uIdx === -1)
        _reply.upVotes.push(user?._id);
      else
        _reply.upVotes.splice(uIdx, 1);
    } else {
      const uIdx = _reply.upVotes.indexOf(user?._id);
      if (uIdx !== -1)
        _reply.upVotes.splice(uIdx, 1);

      const dIdx = _reply.downVotes.indexOf(user?._id);
      if (dIdx === -1)
        _reply.downVotes.push(user?._id);
      else
        _reply.downVotes.splice(dIdx, 1);
    }
    _reply.save();
    const owner = await User.findById(_reply.creator);

    const replies = doubt?.replies?.map((__reply) => {
      if (__reply?.replyData?._id?.toString() !== _reply._id?.toString())
        return __reply;
      else
        return { replyData: _reply, ownerInfo: owner };
    });

    res.status(200).json({ doubtData: doubtData, ownerInfo: doubtOwner, replies: replies });
  } catch (err) {
    res.status(500).json(err);
  }
});

exports.sortReplies = catchAsync(async (req, res) => {
  const { id, type } = req.body;
  try {
    const doubt = await Doubt.findById(id);

    let doubtReplies = [];
    if (type === "most_recent")
      doubtReplies = await Reply.find({ replyToPost: doubt._id }).sort({ createdAt: -1 });
    else {
      doubtReplies = await Reply.find({ replyToPost: doubt._id });
      doubtReplies?.sort((a, b) => b?.upVotes?.length - a?.upVotes?.length);
      doubtReplies = doubtReplies?.splice(-10);
    }
    const replyInfo = [];

    for (const reply of doubtReplies)
      replyInfo.push({ replyData: reply, ownerInfo: await User.findById(reply.creator) });

    const owner = await User.findById(doubt.creator);
    res.status(200).json({ doubtData: doubt, ownerInfo: owner, replies: replyInfo });
  } catch (err) {
    res.status(500).json(err);
  }
});