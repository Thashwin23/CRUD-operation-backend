const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  english: { type: Number, required: true },
  kannada: { type: Number, required: true },
  science: { type: Number, required: true },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
});

module.exports = mongoose.model("Marks", markSchema);
