const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  registerEmployee,
  loginEmployee,
  logoutEmployee,
} = require("../controllers/authController");

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);

// 🔐 Logout (Protected)
router.post("/logout", protect, logoutEmployee);

module.exports = router;
