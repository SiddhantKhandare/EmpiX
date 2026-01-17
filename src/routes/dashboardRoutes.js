const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getHomeDashboard,
} = require("../controllers/dashboardController");

router.get("/home", protect, getHomeDashboard);

module.exports = router;
