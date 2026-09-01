const express = require("express");
const router = express.Router();
const Operator = require("../models/Operator");

// GET /api/operators?type=Excavator
// Returns operators certified for the type AND currently available.
// Without a type it returns all operators (used by the Admin operators panel).
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      const all = await Operator.find().sort({ operatorId: 1 });
      return res.json(all);
    }

    const operators = await Operator.find({
      certifiedEquipmentTypes: type,
      availabilityStatus: "available",
    }).sort({ operatorId: 1 });

    res.json(operators);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch operators", error: err.message });
  }
});

module.exports = router;
