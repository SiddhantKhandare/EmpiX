const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");
const {
  punchIn,
  punchOut,
} = require("../controllers/attendanceController");

router.post(
  "/punch-in",
  protect,
  upload.single("photo"),
  punchIn
);

router.post("/punch-out", protect, punchOut);

module.exports = router;
