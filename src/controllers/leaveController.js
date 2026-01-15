const Leave = require("../models/Leave");
const sendNotification = require("../utils/sendNotification");

//
// @desc Apply Leave (Employee)
// @route POST /api/leave/apply
//
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await Leave.create({
      employee: req.employee._id,
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    // 🔔 Optional: notify employee (confirmation)
    await sendNotification(
      req.employee.fcmToken,
      "Leave Applied",
      "Your leave request has been submitted"
    );

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// @desc Get My Leaves
// @route GET /api/leave/my
//
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.employee._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    console.error("Get My Leaves Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
// @desc Approve / Reject Leave (Admin)
// @route PUT /api/leave/:id
//
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id).populate("employee");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    leave.adminRemark = adminRemark || "";
    await leave.save();

    // 🔔 Push notification to employee
    await sendNotification(
      leave.employee.fcmToken,
      "Leave Status Updated",
      `Your leave request has been ${status.toLowerCase()}`
    );

    res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()}`,
      data: leave,
    });
  } catch (error) {
    console.error("Update Leave Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
