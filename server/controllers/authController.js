const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const UnverifiedUser = require("../models/UnverifiedUser");

const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const hashPassword = async (pass) => {
  pass = await bcrypt.hash(pass, 10);
  return pass;
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 24 * 3600000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    token: token,
    data: user,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let verifiedUser = await User.findOne({ name: name });
    if(verifiedUser){
      res.status(409).json("User already exist with provided username!!");
      return;
    }

    verifiedUser = await User.findOne({ email: email });
    if(verifiedUser){
      res.status(409).json("User already exist with provided Email!!");
    }

    let findUser = await UnverifiedUser.findOne({ name: name });
    if(findUser){
      jwt.verify(findUser.token, name, async (err, data) => {
        if(err){
          await UnverifiedUser.findOneAndDelete({ name: name });
        }else{
          res.status(409).json("User already exist with provided username!!");
          return;
        }
      });
    }

    findUser = await UnverifiedUser.findOne({ email: email });
    if(findUser){
      jwt.verify(findUser.token, name, async (err, data) => {
        console.log(err, data);
        if(err){
          await UnverifiedUser.findOneAndDelete({ email: email });
        }else{
          res.status(409).json("A verification mail has already been sent!!");
          return;
        }
      });
    }
    const hashedPassword = await hashPassword(password);
    const token = createSendToken(name);
    await UnverifiedUser.create({ name: name, email: email, password: hashedPassword, token: token });

    const verificationURL = `http://localhost:3000/verify?user=${name}&token=${token}`;
    const reportURL = `http://localhost:3000/report`;

    const message = `
    <html>
    <body>
        Hello user,
        <br />
            Thankyou for joining with us. Click the below Link to verify your account.
            Please note that the link will work only for 2 hours so kindly verify before it expires.
            <br />
              <a href='${verificationURL}'>Click Here</a>
            <br />
            If this wasn't you please report this activity using below link,
            <br />
              <a href='${reportURL}'>Click Here</a>
            <br />
        Regards,
        CodePro Team
    </html>
    </body>
    `;

    try {
      await sendEmail({
        email: email,
        subject: "Verify your account",
        message: message,
      });
      res.status(201).json("Verification mail sent successfully!");
    } catch (err) {
      res.status(500).json("Internal Error while sending mail!");
      return;
    }

  } catch (err) {
    if (err.code == 11000) {
      res.status(409).json("User already exists!");
    } else {
      console.log(err);
      res.status(500).json("Internal server error! Please try again!!");
    }
  }
});

exports.login = catchAsync(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!user || !isPasswordCorrect) {
    res.status(401).json("Incorrect email or password");
  } else
    createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json("User does not exist in the system!");
    return;
  }

  const resetToken = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  console.log(user);
  const resetURL = `${req.protocol}://${req.get("host")}/user/resetPassword/${resetToken}/${user.name}`;
  const reportURL = `${req.protocol}://${req.get("host")}/report`;

  let message = `Forgot your password ? submit a PATCH request with your new password and password confirm to ${resetURL}`;
  message = `<html>
  <body>
      Hello ${user.name},
      <br />
          We've got an request to reset the password for your account. Click the below Link to reset your password.
          Please note that the link will work only for 2 hours so kindly reset before it expires.
          <br />
            <a href='${resetURL}'>Click Here</a>
          <br />
          If this wasn't you please report this activity using below link,
          <br />
            <a href='${reportURL}'>Click Here</a>
          <br />
      Regards,
      RxChat Team
  </html>
  </body>`

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your password",
      message: message,
    });
    res.status(200).json({
      status: "succes",
      message: "Token send to email !!",
    });
  } catch (err) {
    res.status(500).json("Internal Error while sending mail!");
    return;
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const jwtToken = new URLSearchParams(req.params.token), jwtSecret = new URLSearchParams(req.params.name);
  let jwtString = jwtToken.toString(), secretString = jwtSecret.toString();

  jwtString = jwtString.substring(0, (jwtString.length - 1));
  secretString = secretString.substring(0, (secretString.length - 1));

  jwt.verify(jwtString, secretString, async (err, data) => {
    if(err){
      res.status(400).json("Link is expired!!");
      return;
    }
    res.writeHead(301, {
      Location: `http://localhost:3000/reset/password?user=${secretString}`
    }).end()
  });
});

exports.myProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: req.user,
  });
});