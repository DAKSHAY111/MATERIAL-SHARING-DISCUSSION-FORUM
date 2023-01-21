const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
// const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, postController.createPost);

module.exports = router;
