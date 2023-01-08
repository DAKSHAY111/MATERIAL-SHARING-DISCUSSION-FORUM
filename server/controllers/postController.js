const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

exports.uploadFile = catchAsync(async (req, res, next) => {
  
});
