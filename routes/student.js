// const express = require("express");
// const router = express.Router();
// const Student = require("../models/student");

// // Create a new student
// router.post("/post", async (req, res) => {
//   try {
//     const StudentData = await Student.create(req.body);
//     res.status(200).json(StudentData);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Other CRUD routes for students

// module.exports = router;

const express = require("express");
const router = express.Router();
const Student = require("../models/student");
// const student = require("../models/student");
const imageModel = require("../models/image");
const cors = require("cors");
const app = express();
app.use(cors());

const multer = require("multer");

// Create a new student
router.get("/fetch/new/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const students = await Student.findOne({ _id: studentId }).populate(
      "class_id"
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/post", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all students
router.get("/fetch", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single student
router.get("/fetch/:id", getStudent, (req, res) => {
  res.json(res.student);
});

// Update a student
router.put("/update/:id", getStudent, async (req, res) => {
  if (req.body.name != null) {
    res.student.name = req.body.name;
  }
  if (req.body.class_id != null) {
    res.student.class_id = req.body.class_id;
  }
  if (req.body.age != null) {
    res.student.age = req.body.age;
  }
  if (req.body.bloodgroup != null) {
    res.student.bloodgroup = req.body.bloodgroup;
  }
  try {
    const updatedStudent = await res.student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student
router.delete("/delete/:id", getStudent, async (req, res) => {
  try {
    await Mark.findByIdAndDelete(res.mark._id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
});

router.get("/images", async (req, res) => {
  try {
    const images = await imageModel.find();
    if (!images) {
      return res.status(404).json({ message: "no images found" });
    }
    res.status(200).send(images);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occured while processsing your request " });
  }
});

// router.post("/upload", async (req, res) => {
//   upload((req, res) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const newImage = new imageModel({
//         name: req.body.name,
//         image: {
//           data: req.file.filename,
//           contentType: mimetype,
//         },
//       });
//       newImage
//         .save()
//         .then(() => res.send("successfully uploaded"))
//         .catch((err) => console.log(err));
//     }
//   });
// });
// Specify the destination folder for file uploads

// multer is used to upload the file.we can upload images inside the folder and also we can store it in database with buffer

router.post("/upload", upload.single("testImage"), async (req, res) => {
  try {
    const { filename, mimetype, path } = req.file;

    // Create a new image document with image details
    const newImage = new imageModel({
      name: req.body.name,
      image: {
        data: filename, // Store the filename in MongoDB
        contentType: mimetype, // Store the MIME type of the image
      },
    });

    // Save the new image document to MongoDB
    await newImage.save();

    res.send("Image successfully uploaded");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing your request");
  }
});

// Middleware function to get student by id
async function getStudent(req, res, next) {
  let student;
  try {
    student = await Student.findById(req.params.id);
    if (student == null) {
      return res.status(404).json({ message: "Student not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.student = student;
  next();
}

module.exports = router;
