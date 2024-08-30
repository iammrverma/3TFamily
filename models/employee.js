const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Mr India" },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  joinDate: { type: Date, required: true },
  address: {
    country: String,
    state: String,
    city: String,
    location: String,
  },
  salary: { type: Number },
  image:{
    type:String,
    default :"https://via.placeholder.com/150"
  }
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
