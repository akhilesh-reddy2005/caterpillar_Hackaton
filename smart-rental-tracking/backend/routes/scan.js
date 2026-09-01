const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Operator = require("../models/Operator");

// POST /api/scan/validate  { bookingId }
router.post("/validate", async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.json({ success: false, message: "Invalid booking" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.json({ success: false, message: "Payment not confirmed" });
    }

    const equipment = await Equipment.findOne({ equipmentId: booking.equipmentId });
    let operator = null;
    if (booking.assignedOperatorId) {
      operator = await Operator.findOne({ operatorId: booking.assignedOperatorId });
    }

    if (booking.qrStatus === "unused") {
      return res.json({
        success: true,
        action: "confirm-pickup",
        booking,
        equipment,
        operator,
      });
    }

    if (booking.qrStatus === "checked-out") {
      return res.json({
        success: true,
        action: "confirm-return",
        booking,
        equipment,
      });
    }

    // completed or expired
    return res.json({
      success: false,
      message: "Booking already completed/expired",
    });
  } catch (err) {
    res.status(500).json({ message: "Validation failed", error: err.message });
  }
});

// POST /api/scan/confirm-pickup  { bookingId, siteId, operatorId }
router.post("/confirm-pickup", async (req, res) => {
  try {
    const { bookingId, siteId, operatorId } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ message: "Invalid booking" });
    if (booking.qrStatus !== "unused") {
      return res.status(400).json({ message: "Booking is not ready for pickup" });
    }

    const equipment = await Equipment.findOne({ equipmentId: booking.equipmentId });
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });

    const now = new Date();
    // Expected return = pickup time + the number of days the customer booked
    const expectedReturn = new Date(
      now.getTime() + (booking.rentalDays || 7) * 24 * 60 * 60 * 1000
    );

    booking.checkOutDate = now;
    booking.expectedReturnDate = expectedReturn;
    booking.qrStatus = "checked-out";

    equipment.checkOutDate = now;
    equipment.checkInDate = expectedReturn; // expected return date (drives overdue / due-soon)
    equipment.actualReturnDate = null;
    equipment.status = "active";
    if (siteId) equipment.siteId = siteId;

    if (booking.operatorRequest === "caterpillar-assigned" && booking.assignedOperatorId) {
      equipment.lastOperatorId = booking.assignedOperatorId;
      equipment.operatorSource = "caterpillar-assigned";
    } else if (operatorId) {
      equipment.lastOperatorId = operatorId;
      equipment.operatorSource = "self";
    }

    await booking.save();
    await equipment.save();

    res.json({ success: true, message: "Pickup confirmed", booking, equipment });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm pickup", error: err.message });
  }
});

// POST /api/scan/confirm-return  { bookingId }
router.post("/confirm-return", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ message: "Invalid booking" });
    if (booking.qrStatus !== "checked-out") {
      return res.status(400).json({ message: "Booking is not checked out" });
    }

    const equipment = await Equipment.findOne({ equipmentId: booking.equipmentId });
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });

    const now = new Date();

    booking.checkInDate = now; // actual return time
    booking.qrStatus = "completed";

    // keep equipment.checkInDate as the EXPECTED return date; record the actual one
    equipment.actualReturnDate = now;
    equipment.status = "available";

    if (equipment.operatorSource === "caterpillar-assigned" && booking.assignedOperatorId) {
      const operator = await Operator.findOne({ operatorId: booking.assignedOperatorId });
      if (operator) {
        operator.availabilityStatus = "available";
        await operator.save();
      }
    }

    await booking.save();
    await equipment.save();

    res.json({ success: true, message: "Return confirmed", booking, equipment });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm return", error: err.message });
  }
});

module.exports = router;
