const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/verify').post(authController.verifyAccount);
router.route("/new/password").post(authController.forgotPassword);
router.route("/reset/password").post(authController.resetPassword);

module.exports = router;