const Attendance = require("../models/Attendance");
const sendNotification = require("../utils/sendNotification");

//
// @desc Punch In
// @route POST /api/attendance/punch-in
//
exports.punchIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if already punched in
    const alreadyMarked = await Attendance.findOne({
      employee: req.employee._id,
      date: today,
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const attendance = await Attendance.create({
      employee: req.employee._id,
      date: today,
      punchInTime: new Date(),
      punchInPhoto: req.file ? req.file.path : "",
    });

    // 🔔 Push notification
    await sendNotification(
      req.employee.fcmToken,
      "Attendance Marked",
      "Your punch-in has been recorded successfully"
    );

    res.status(201).json({
      success: true,
      message: "Punch In successful",
      data: attendance,
    });
  } catch (error) {
    console.error("Punch In Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// @desc Punch Out
// @route POST /api/attendance/punch-out
//
exports.punchOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({
      employee: req.employee._id,
      date: today,
    });

    if (!attendance) {
      return res.status(400).json({ message: "Punch In first" });
    }

    if (attendance.punchOutTime) {
      return res.status(400).json({ message: "Already punched out" });
    }

    attendance.punchOutTime = new Date();
    await attendance.save();

    // 🔔 Push notification
    await sendNotification(
      req.employee.fcmToken,
      "Attendance Updated",
      "Your punch-out has been recorded successfully"
    );

    res.status(200).json({
      success: true,
      message: "Punch Out successful",
      data: attendance,
    });
  } catch (error) {
    console.error("Punch Out Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
