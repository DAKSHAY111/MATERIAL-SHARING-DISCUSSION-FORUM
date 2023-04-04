const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

dotenv.config();
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const port = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

mongoose.set("strictQuery", false);
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
