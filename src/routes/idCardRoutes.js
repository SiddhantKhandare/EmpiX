const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { generateIdCard } = require("../controllers/idCardController");

router.get("/generate", protect, generateIdCard);

module.exports = router;
