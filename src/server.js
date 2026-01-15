require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const idCardRoutes = require("./routes/idCardRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");



const app = express();

// 🔌 Connect MongoDB
connectDB();

// 🌐 Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("🚀 Empix Backend Running");
});

// 🔐 Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/idcard", idCardRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/notification", notificationRoutes);



// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
