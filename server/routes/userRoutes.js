const express = require("express");
const authController = require("./../controllers/authController");
// const orderController = require("../controllers/orderController");

const router = express.Router();

router.route("/").get((req, res) => {
  res.status(200).json({
    message: "Hello User",
  });
});

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router.patch("/updateMe", authController.protect, authController.updateMe);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.route("/profile").get(authController.protect, authController.myProfile);
module.exports = router;
