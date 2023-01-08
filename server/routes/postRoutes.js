const express = require("express");
const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
// const orderController = require("../controllers/orderController");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Hello User",
  });
});

router.route("/testImage").post(postController.testImage);
router.route("/upload").post(postController.uploadFile);
module.exports = router;
