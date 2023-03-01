const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/create")
  .post(authController.protect, postController.createPost);

router.route("/fetch/all").post(postController.fetchAll);

module.exports = router;
