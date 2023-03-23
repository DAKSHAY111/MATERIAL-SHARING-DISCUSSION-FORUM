const express = require("express");

const doubtController = require("../controllers/doubtController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/create").post(authController.protect, doubtController.createDoubt);
router.route("/fetch/all").get(doubtController.fetchAll);

module.exports = router;