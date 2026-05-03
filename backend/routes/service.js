const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ServiceRecord = require('../models/ServiceRecord');
const auth = require('../middleware/auth');
const User = require('../models/User');

// ─── Multer Storage Setup ─────────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
  
    cb(null, 'BILL-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
});


router.post('/add', auth, upload.single('billImage'), async (req, res) => {
  try {
    const { vehicleNumber, serviceType, mileage, description, cost } = req.body;

    const newRecord = new ServiceRecord({
      userId: req.user.id,
      vehicleNumber,
      serviceType,
      mileage,
      description,
      cost,
     
      billImage: req.file ? `/uploads/${req.file.filename}` : null 
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    console.error('Error adding service:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// 2. Get All Records for Logged in User (GET)
router.get('/my-history', auth, async (req, res) => {
  try {
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const records = await ServiceRecord.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("History Fetch Error:", err.message);
    res.status(500).json({ message: "Error fetching your history" });
  }
});

// 3. Delete Service Record (DELETE)
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await ServiceRecord.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', auth, upload.single('billImage'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
   
    updateData.status = 'Pending'; 

    if (req.file) {
      updateData.billImage = `/uploads/${req.file.filename}`;
    }

    const updatedRecord = await ServiceRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedRecord) return res.status(404).json({ message: "Record not found" });
    res.json(updatedRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/admin/all', auth, async (req, res) => {
  try {
    const records = await ServiceRecord.find()
      .populate({
        path: 'userId',
        select: 'fullName email'
      })
      .sort({ createdAt: -1 });


    const validRecords = records.filter(r => r.userId);
    res.json(validRecords);
  } catch (err) {
    console.error("❌ Admin Fetch Error:", err);
    res.status(500).json({ error: "Database error during fetch" });
  }
});

router.patch('/admin/status/:id', auth, async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const record = await ServiceRecord.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;