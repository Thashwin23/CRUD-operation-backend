const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: { type: String },
  class_name: { type: String },
  teacher_name: { type: String },
});

module.exports = mongoose.model("Classrooms", classroomSchema);
