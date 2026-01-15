const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.generateIdCard = async (req, res) => {
  try {
    const employee = req.employee;

    const fileName = `ID-${employee.employeeId}.pdf`;
    const filePath = path.join("uploads", fileName);

    const doc = new PDFDocument({ size: "A7", margin: 10 });
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc
      .fontSize(14)
      .text("EMPIX", { align: "center" })
      .moveDown(0.5);

    // Profile Photo
    if (employee.profilePhoto) {
      doc.image(employee.profilePhoto, 30, 40, { width: 60 });
    }

    doc.moveDown(3);

    // Employee Info
    doc.fontSize(10);
    doc.text(`Name: ${employee.firstName} ${employee.lastName}`);
    doc.text(`Emp ID: ${employee.employeeId}`);
    doc.text(`Dept: ${employee.department}`);
    doc.text(`Role: ${employee.designation}`);

    doc.moveDown(1);
    doc.fontSize(8).text("Valid Employee ID", { align: "center" });

    doc.end();

    res.status(200).json({
      success: true,
      message: "ID Card generated",
      url: `http://localhost:5000/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("ID Card Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
