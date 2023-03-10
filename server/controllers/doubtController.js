const catchAsync = require("../utils/catchAsync");
const Doubt = require("../models/doubtModel");
const User = require("../models/userModel");

exports.createDoubt = catchAsync(async (req, res) => {

    const { doubt, description, tags , media , user } = req.body;
        try {
            const newDoubt = await Doubt.create({
            doubt: doubt,
            description: description,
            tags: tags,
            creator: user._id,
            createdAt: Date.now(),
            media: media,
            });
            delete newDoubt._id;
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
    const {doubt,user,type} = req.body;

    try {
        const doubt = await doubt.findById(doubtData._id);
        const owner = await User.findById(doubt.creator);
    
        if(type === "up"){
          if(doubt.downVotes.indexOf(user._id) !== -1)
            doubt.downVotes.splice(doubt.downVotes.indexOf(user._id), 1);
    
          if(doubt.upVotes.indexOf(user._id) === -1)
            doubt.upVotes.push(user._id);
          else
            doubt.upVotes.splice(doubt.upVotes.indexOf(user._id), 1);
        }
        else{
          if(doubt.upVotes.indexOf(user._id) !== -1)
            doubt.upVotes.splice(doubt.upVotes.indexOf(user._id), 1);
            
          if(doubt.downVotes.indexOf(user._id) === -1)
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

