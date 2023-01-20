const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
// const orderController = require("../controllers/orderController");

const router = express.Router();

// router.route("/upload").post(postController.uploadFile);

router
  .route("/")
  // .get(postController.getAllPosts)
  .post(authController.protect, postController.createPost);

module.exports = router;
