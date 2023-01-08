const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var morgan = require("morgan");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middlewares
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

// For prefix matching
app.use("/user", userRoutes);
app.use("/post", postRoutes);

app.all("*", (req, res) => {
  res.status(500).json("Internal Error");
});
