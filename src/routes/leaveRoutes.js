const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  applyLeave,
  getMyLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

router.post("/apply", protect, applyLeave);
router.get("/my", protect, getMyLeaves);

// Admin (for now protected only)
router.put("/:id", protect, updateLeaveStatus);

module.exports = router;
