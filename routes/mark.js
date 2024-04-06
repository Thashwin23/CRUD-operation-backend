const express = require("express");
const router = express.Router();
const Mark = require("../models/mark");

// Create a new mark
router.post("/post", async (req, res) => {
  try {
    const mark = await Mark.create(req.body);
    res.status(201).json(mark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all marks
router.get("/fetch/:MarkId", async (req, res) => {
  try {
    const { markId } = req.params;
    const marks = await Mark.findOne((_id = markId)).populate("student_id");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single mark
router.get("/fetch/:id", getMark, (req, res) => {
  res.json(res.mark);
});

// Update a mark
router.put("/update/:id", getMark, async (req, res) => {
  if (req.body.english != null) {
    res.mark.english = req.body.english;
  }
  if (req.body.kannada != null) {
    res.mark.kannada = req.body.kannada;
  }
  if (req.body.science != null) {
    res.mark.science = req.body.science;
  }
  try {
    const updatedMark = await res.mark.save();
    res.json(updatedMark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/total", async (req, res) => {
  try {
    // console.log("hereeeee");
    // const data = await Mark.aggregate([
    //   {
    //     $project: { english: 1 },
    //     avgMarks: {
    //       $avg: "$english",
    //     },
    //   },
    // ]);
    // res.json(data);

    const allMarks = await Mark.find();
    const Marks = allMarks.map((mark) => mark.english);
    const avgMarks =
      Marks.reduce((total, mark) => total + mark, 0) / Marks.length;

    res.json({ "Average mark of English": avgMarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a mark
router.delete("/delete/:id", getMark, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(res.mark._id);
    res.json({ message: "Mark deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/otp", async (res, req) => {
  try {
    const OTP = () => Math.floor(Math.random() * 10000) + 1000;
    res.status(200).json(OTP);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get mark by id
async function getMark(req, res, next) {
  let mark;
  try {
    mark = await Mark.findById(req.params.id);
    if (mark == null) {
      return res.status(404).json({ message: "Mark not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.mark = mark;
  next();
}

module.exports = router;
