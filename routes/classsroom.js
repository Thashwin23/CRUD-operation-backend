const express = require("express");
const router = express.Router();
const Classroom = require("../models/classroom");

// Create a new classroom
router.post("/post", async (req, res) => {
  try {
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all classrooms
router.get("/fetch", async (req, res) => {
  try {
    const classroom = await Classroom.find();
    res.json(classroom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single classroom
router.get("/fetch/:id", getClassroom, (req, res) => {
  res.json(res.classroom);
});

// Update a classroom
router.put("/update/:id", getClassroom, async (req, res) => {
  if (req.body.name != null) {
    res.classroom.name = req.body.name;
  }
  if (req.body.class_name != null) {
    res.classroom.class_name = req.body.class_name;
  }
  if (req.body.teacher_name != null) {
    res.classroom.teacher_name = req.body.teacher_name;
  }
  try {
    const updatedClassroom = await res.classroom.save();
    res.json(updatedClassroom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a classroom
router.delete("/delete/:id", getClassroom, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(res.mark._id);
    res.json({ message: "Classroom deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get classroom by id
async function getClassroom(req, res, next) {
  let classroom;
  try {
    classroom = await Classroom.findById(req.params.id);
    if (classroom == null) {
      return res.status(404).json({ message: "Classroom not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.classroom = classroom;
  next();
}

module.exports = router;

// router.post("/post", async (req, res) => {
//   try {
//     const userdetails = req.body;

//     // Check if the email already exists in the database
//     const existingUser = await User.findOne({ email: userdetails.email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email is already in use" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(userdetails.password, 10);
//     userdetails.password = hashedPassword;

//     // Create the new user
//     const newUser = await User.create(userdetails);
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
