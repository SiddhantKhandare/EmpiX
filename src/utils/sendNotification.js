const admin = require("../config/firebase");

const sendNotification = async (fcmToken, title, body) => {
  if (!fcmToken) return;

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
    },
  };

  try {
    await admin.messaging().send(message);
  } catch (error) {
    console.error("Notification Error:", error);
  }
};

module.exports = sendNotification;
