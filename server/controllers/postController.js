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
  const { selectedTags } = req.body.filters;
  try {
    if (selectedTags.length === 0) {
      const allPosts = await Post.find({}, { _id: 0 });
      const result = [];

      for(let i=0;i<allPosts.length;++i){
        const owner = await User.findById(allPosts[i].creator, { _id: 0, password: 0, email: 0 });
        result.push({ postData: allPosts[i], ownerInfo: owner });
      }
      res.status(200).json(result);
    } else {
      let allPosts = [];
      for (const tag in selectedTags) {
        const pipeline = [
          {
            '$match': {
              'tags': {
                '$in': [
                  selectedTags[tag], '$tags'
                ]
              }
            }
          }
        ]
        const op = await Post.aggregate(pipeline);
        allPosts = allPosts.concat(op);
      }
      
      const result = [];
      const mp = new Map();

      for(let i=0;i<allPosts.length;++i){
        if(mp.get(allPosts[i]._id.toString()) === undefined){

          const owner = await User.findById(allPosts[i].creator, { _id: 0, password: 0, email: 0 });
          result.push({ postData: allPosts[i], ownerInfo: owner });
          mp.set(allPosts[i]._id.toString(), 1);

        }
      }
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json("Couldn't find posts!! Please refresh and try again!!");
  }
});