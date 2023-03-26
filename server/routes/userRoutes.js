const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route('/logout').post(authController.protect, authController.logout);
router.route('/verify').get(authController.verifyAccount);
router.route("/new/password").post(authController.forgotPassword);
router.route("/reset/password").post(authController.resetPassword);
router.route("/add/starred").post(authController.protect, authController.addToStarred);
router.route("/fetch/favourites").post(authController.protect, authController.favourites);
router.route("/fetch/data").post(authController.protect, authController.fetchData);
router.route("/update/profile").post(authController.protect, authController.updateProfile);

module.exports = router;