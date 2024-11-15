const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8001;

// MongoDB connection string
const mongoDB = "mongodb://127.0.0.1/MyDb";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB Connection is successful..."))
  .catch(err => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors());
app.use(express.json());

// Define the schema
const doctorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  specialization: String,
  phone_number: Number,
  location: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Get all doctors
app.get("/getAlldoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Insert a doctor
app.post("/insertDoctor", async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a doctor
// Update a doctor
app.put("/updateData", async (req, res) => {
  try {
    const { id, name, specialization, phone_number, location } = req.body;
    
    // Find the doctor by id and update
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { id: id },  // Find by custom id
      { name, specialization, phone_number, location },
      { new: true, runValidators: true }  // Return the updated document
    );

    if (!updatedDoctor) {
      return res.status(404).json("Doctor not found.");
    }

    res.status(200).json(updatedDoctor);  // Respond with the updated document
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Delete a doctor by ID
app.delete("/deleteRecord/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.deleteMany({ id });
    res.status(200).json("Record deleted successfully.");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
