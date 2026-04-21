const express = require("express");
const router = express.Router();

const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.patch("/:id/status", updatePaymentStatus);
router.delete("/:id", deletePayment);

module.exports = router;