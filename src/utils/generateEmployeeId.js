const Employee = require("../models/Employee");

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });

  let newIdNumber = 1;

  if (lastEmployee && lastEmployee.employeeId) {
    const lastNumber = parseInt(lastEmployee.employeeId.split("-")[1]);
    newIdNumber = lastNumber + 1;
  }

  return `EMPX-${String(newIdNumber).padStart(4, "0")}`;
};

module.exports = generateEmployeeId;
