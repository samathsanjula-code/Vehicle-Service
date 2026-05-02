const Mechanic = require("../models/Mechanic");

// Get all mechanics
const getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find();
    res.json(mechanics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create a new mechanic
const createMechanic = async (req, res) => {
  try {
    const { fullName, specialty, phone, experience, status } = req.body;

    const newMechanic = new Mechanic({
      fullName,
      specialty,
      phone,
      experience,
      status: status || "Available",
    });

    const mechanic = await newMechanic.save();
    res.status(201).json(mechanic);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get mechanic by ID
const getMechanicById = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ msg: "Mechanic not found" });
    res.json(mechanic);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update mechanic
const updateMechanic = async (req, res) => {
  try {
    const { fullName, specialty, phone, experience, status } = req.body;
    let mechanic = await Mechanic.findById(req.params.id);

    if (!mechanic) return res.status(404).json({ msg: "Mechanic not found" });

    mechanic.fullName = fullName || mechanic.fullName;
    mechanic.specialty = specialty || mechanic.specialty;
    mechanic.phone = phone || mechanic.phone;
    mechanic.experience = experience || mechanic.experience;
    mechanic.status = status || mechanic.status;

    await mechanic.save();
    res.json(mechanic);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete mechanic
const deleteMechanic = async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ msg: "Mechanic not found" });

    await mechanic.deleteOne();
    res.json({ msg: "Mechanic removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllMechanics,
  createMechanic,
  getMechanicById,
  updateMechanic,
  deleteMechanic,
};
