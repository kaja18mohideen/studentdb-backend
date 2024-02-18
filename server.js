

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/studentdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    class: String
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Student = mongoose.model("Student", studentSchema);

app.use(express.json());
app.use(cors())
app.options("*", cors())

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({});
    if (students.length > 0) {
      res.status(200).json(students);
    } else {
      res.status(204).json("data not found");
    }

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    if (req.body) {
      const data = await Student.insertMany(req.body)
      res.status(201).json(data);
    } else {
      res.status(400).json("Bad request")
    }
    // const savedStudent = await newStudent.save();
  } catch (error) {
    console.error("Error creating student:", error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Invalid student data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating student" });
    }
  }
});


app.put("/api/students/:id", async (req, res) => {
  try {
    console.log('body', req.body)
    const data = await Student.findByIdAndUpdate(req.params.id, { name: req.body.name })
    const datum = await Student.find()
    res.status(202).json(datum)
  } catch (error) {
    console.error("Error creating student:", error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Invalid student data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating student" });
    }
  }
});


app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete({ _id: req.params.id })
    const datum = await Student.find()
    res.status(202).json(datum)
  } catch (error) {
    console.error("Error creating student:", error);
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Invalid student data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Error creating student" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
