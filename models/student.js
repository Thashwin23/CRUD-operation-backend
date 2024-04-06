const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classrooms" }],
  age: { type: Number, required: true },
  bloodgroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    default: "NA",
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
