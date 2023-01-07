const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

exports.testImage = catchAsync(async (req, res, next) => {
  console.log(req.body);
  res.status(200).json({
    message: "Image Received",
  });
});

exports.uploadFile = catchAsync(async (req, res, next) => {
  console.log(req.body);

  res.status(200).json({
    message: "HEllo",
  });
});
