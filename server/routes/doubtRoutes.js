const express = require("express");

const doubtController = require("../controllers/doubtController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/create").post(authController.protect, doubtController.createDoubt);
router.route("/delete").post(authController.protect, doubtController.deleteDoubt);
router.route("/fetch/all").get(doubtController.fetchAll);
router.route("/fetch/doubt").post(doubtController.fetchSingleDoubt);
router.route("/vote").post(authController.protect, doubtController.vote);
router.route("/vote/reply").post(authController.protect, doubtController.voteToReply);
router.route("/sort/reply").post(doubtController.sortReplies);
router.route("/create/reply").post(authController.protect, doubtController.addReply);

module.exports = router;