const catchAsync = require("./../utils/catchAsync");
// const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

const { promisify } = require("util");

//* <------------------JWT -------------------------->
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 24 * 3600000),
    // secure: true,
    httpOnly: true,
    // samesite: false,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

//* <------------------------- Sign In ------------------------->

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
  // const token = signToken(newUser.__id);

  // res.status(200).json({
  //   message: "success",
  //   token,
  //   data: { use: newUser },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log(user);
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);

  // const token = signToken(user.__id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  req.requestTime = new Date().toISOString;

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  //* 2) verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //* 3) check if user is still exist

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token is not exist", 401)
    );
  }

  if (freshUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again")
    );
  }
  console.log(freshUser);
  req.user = freshUser;
  next();
});

// exports.authenticate = catchAsync(async (req, res, next) => {
//   const token = req.cookie.jwt;
// });

//*<--------------------- Forget Password ------------------------->

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user exist with this email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log(user);
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/OTS/user/resetPassword/${resetToken}`;

  const message = `Forgot your password ? submit a PATCH request with your new password and password confirm to ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "succes",
      message: "Token send to email !!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error in sending mail, Try again", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user.__id);

  res.status(200).json({
    status: "success",
    token,
  });

  next();
});

//*<--------------------- validate only for admin  ------------------------->

exports.isAdmin = (req, res, next) => {
  console.log(req.user.role);
  if (req.user.role === "admin") {
    next();
  } else {
    return next(new AppError("You are not an admin", 401));
  }
};

//* <-----------------User --------------->

exports.myProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for update Please use /updateMyPassword",
        400
      )
    );
  }
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "contact",
    "address"
  );
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: "success",
    data: updatedUser,
  });
});
