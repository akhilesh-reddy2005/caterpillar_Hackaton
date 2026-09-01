const express = require("express");
const router = express.Router();

const Equipment = require("../models/Equipment");
const Maintenance = require("../models/Maintenance");
const Booking = require("../models/Booking");
const Operator = require("../models/Operator");

// GET /api/chatbot-context
// Combined snapshot consumed by the n8n chatbot workflow.
router.get("/chatbot-context", async (req, res) => {
  try {
    const [equipment, maintenance, bookings, operators] = await Promise.all([
      Equipment.find(),
      Maintenance.find(),
      Booking.find(),
      Operator.find(),
    ]);

    res.json({ equipment, maintenance, bookings, operators });
  } catch (err) {
    res.status(500).json({ message: "Failed to build chatbot context", error: err.message });
  }
});

module.exports = router;
