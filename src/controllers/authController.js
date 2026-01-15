const Employee = require("../models/Employee");
const generateEmployeeId = require("../utils/generateEmployeeId");
const jwt = require("jsonwebtoken");




exports.registerEmployee = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      department,
      designation,
      password,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !department ||
      !designation ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing employee
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    // Generate Employee ID
    const employeeId = await generateEmployeeId();

    // Create employee
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email,
      mobile,
      department,
      designation,
      password,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        token,
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
        },
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find employee
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.logoutEmployee = async (req, res) => {
  try {
    // Remove FCM token on logout
    req.employee.fcmToken = "";
    await req.employee.save();

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
