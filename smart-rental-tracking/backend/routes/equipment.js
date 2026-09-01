const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");

// GET /api/equipment?siteId=S003&status=available
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.siteId) filter.siteId = req.query.siteId;
    if (req.query.status) filter.status = req.query.status;

    const equipment = await Equipment.find(filter).sort({ equipmentId: 1 });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch equipment", error: err.message });
  }
});

// GET /api/equipment/:id  (id = equipmentId)
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findOne({ equipmentId: req.params.id });
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch equipment", error: err.message });
  }
});

module.exports = router;
