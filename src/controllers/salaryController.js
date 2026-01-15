const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.generateSalarySlip = async (req, res) => {
  try {
    const { month, basic, hra, allowance, deduction } = req.body;

    if (!month || !basic || !hra) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const employee = req.employee;
    const netSalary =
      Number(basic) + Number(hra) + Number(allowance || 0) - Number(deduction || 0);

    const fileName = `Salary-${employee.employeeId}-${month}.pdf`;
    const filePath = path.join("uploads", fileName);

    const doc = new PDFDocument({ size: "A4", margin: 30 });
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("EMPIX SALARY SLIP", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Employee: ${employee.firstName} ${employee.lastName}`);
    doc.text(`Employee ID: ${employee.employeeId}`);
    doc.text(`Month: ${month}`);
    doc.moveDown();

    doc.text(`Basic Salary: ₹${basic}`);
    doc.text(`HRA: ₹${hra}`);
    doc.text(`Allowance: ₹${allowance || 0}`);
    doc.text(`Deduction: ₹${deduction || 0}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Salary: ₹${netSalary}`, {
      underline: true,
    });

    doc.end();

    res.status(200).json({
      success: true,
      message: "Salary slip generated",
      url: `http://localhost:5000/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Salary Slip Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
