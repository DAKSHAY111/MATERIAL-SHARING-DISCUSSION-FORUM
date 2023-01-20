// const dotenv = require("dotenv");
// dotenv.config();
// require("./connection");

// const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// var morgan = require("morgan");

// // Routes
// const userRoutes = require("./routes/userRoutes");
// const postRoutes = require("./routes/postRoutes");

// const app = express();

// // Middlewares
// app.use(morgan("dev"));
// app.use(cookieParser());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors({ credentials: true }));
// express.urlencoded({ extended: false });

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// // For prefix matching
// app.use("/user", userRoutes);
// app.use("/post", postRoutes);

// app.all("*", (req, res) => {
//   res.status(500).json("Internal Error");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on ${process.env.PORT}`);
// });

const dotenv = require("dotenv");
const express = require("express");
const app = require("./app");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB CONNECTED SUCCESSFULLY!");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
