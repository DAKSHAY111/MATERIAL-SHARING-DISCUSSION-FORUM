const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

// router.patch("/updateProfile", authController.protect, authController.updateMe);

router.route("/forgotPassword").post(authController.forgotPassword);

// router.route("/resetPassword/:token").patch(authController.resetPassword);
// router.route("/profile").get(authController.protect, authController.myProfile);

module.exports = router;