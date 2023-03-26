const catchAsync = require("../utils/catchAsync");
const Doubt = require("../models/doubtModel");
const User = require("../models/userModel");

exports.createDoubt = catchAsync(async (req, res) => {

  const { doubtTitle, description, tags, media, user } = req.body;
  try {
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
  } catch (err) {
    res.status(500).json("Couldn't create doubt!! Please try again!");
  }
}
);

exports.deleteDoubt = catchAsync(async (req, res) => {
  const { doubt } = req.body;
  try {
    const deletedDoubt = await Doubt.findByIdAndDelete(doubt._id);
    res.status(201).json(deletedDoubt);
  } catch (err) {
    res.status(500).json("Couldn't delete doubt!! Please try again!");
  }
});


exports.addReply = catchAsync(async (req, res) => {
  const { doubt, reply } = req.body;
  try {
    const doubt = await Doubt.findById(doubt._id);
    doubt.replies.push(reply);
    doubt.save();
    res.status(201).json(doubt);
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
    res.status(200).json({ doubtData: doubt, ownerInfo: owner });
  } catch (err) {
    res.status(500).json("Error occurred while processing! Please try again!");
  }
});

exports.fetchAll = catchAsync(async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    const response = [];

    for(const doubt of doubts){
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
  try{
    const doubt = await Doubt.findById(id);
    doubt.views += 1;

    doubt.save();

    const owner = await User.findById(doubt.creator);
    res.status(200).json({ doubtData: doubt, ownerInfo: owner });
  }catch(err){
    req.status(500).json("Internal server error! Please try again!");
  }
});