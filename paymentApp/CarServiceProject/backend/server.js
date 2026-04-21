const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/test", (req, res) => {
  console.log("TEST route hit");
  res.send("Backend is working!");
});

// HEALTH ROUTE
app.get("/api/health", (req, res) => {
  console.log("HEALTH route hit");
  res.json({
    success: true,
    message: "API healthy",
  });
});

// PAYMENT ROUTES
app.use("/api/payments", paymentRoutes);

// MongoDB + Server start
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });