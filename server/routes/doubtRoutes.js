const express = require("express");

const doubtController = require("../controllers/doubtController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/create").post(authController.protect, doubtController.createDoubt);
router.route("/fetch/all").get(doubtController.fetchAll);
router.route("/fetch/doubt").post(doubtController.fetchSingleDoubt);
router.route("/vote").post(authController.protect, doubtController.vote);

module.exports = router;