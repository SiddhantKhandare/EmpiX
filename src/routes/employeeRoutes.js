const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

router.get("/profile", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.employee,
  });
});

module.exports = router;
