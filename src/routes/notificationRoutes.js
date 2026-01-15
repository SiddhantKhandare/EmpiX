const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { saveFcmToken } = require("../controllers/notificationController");

router.post("/save-token", protect, saveFcmToken);

module.exports = router;
