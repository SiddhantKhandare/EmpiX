const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { generateSalarySlip } = require("../controllers/salaryController");

router.post("/generate", protect, generateSalarySlip);

module.exports = router;
