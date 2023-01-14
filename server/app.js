const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var morgan = require("morgan");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ credentials: true }));
express.urlencoded({ extended: false });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

module.exports = app.get("/OTS/getcookie", (req, res) => {
  res.cookie(`Cookie token name`, `encrypted cookie string Value`);
  res.status(200).json({
    msg: "cookie set",
  });
});

app.use("/MaterialShare/user", userRoutes);
app.use("/MaterialShare/post", postRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});
