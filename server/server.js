const dotenv = require("dotenv");
const express = require("express");
const app = require("./app");
const mongoose = require("mongoose");
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT || 3000;

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
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
