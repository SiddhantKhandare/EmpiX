exports.saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token required" });
    }

    req.employee.fcmToken = fcmToken;
    await req.employee.save();

    res.status(200).json({
      success: true,
      message: "FCM token saved",
    });
  } catch (error) {
    console.error("FCM Save Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
