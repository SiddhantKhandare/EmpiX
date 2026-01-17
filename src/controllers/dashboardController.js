const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

exports.getHomeDashboard = async (req, res) => {
  try {
    const employeeId = req.employee._id;

    const today = new Date().toISOString().split("T")[0];

    // 🔹 Today attendance
    const todayAttendance = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    // 🔹 Monthly attendance (current month)
    const monthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const monthlyAttendance = await Attendance.countDocuments({
      employee: employeeId,
      createdAt: { $gte: monthStart },
    });

    // 🔹 Leave data
    const pendingLeaves = await Leave.countDocuments({
      employee: employeeId,
      status: "PENDING",
    });

    const approvedLeaves = await Leave.countDocuments({
      employee: employeeId,
      status: "APPROVED",
    });

    // 🔹 Salary (STATIC FOR NOW – MODEL LATER)
    const salary = {
      amount: 45000,
      month: "Jan 2026",
    };

    res.status(200).json({
      success: true,
      data: {
        attendance: {
          todayStatus: todayAttendance ? "Present" : "Not Marked",
          checkIn: todayAttendance?.punchInTime || null,
          checkOut: todayAttendance?.punchOutTime || null,
          monthlyPresent: monthlyAttendance,
          monthlyTotal: 22,
        },
        leave: {
          pending: pendingLeaves,
          approved: approvedLeaves,
          balance: 10,
        },
        salary,
        notifications: pendingLeaves > 0 ? 1 : 0,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
