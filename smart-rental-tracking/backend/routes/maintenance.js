const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

// GET /api/maintenance?status=pending
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const records = await Maintenance.find(filter).sort({ reportedDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch maintenance", error: err.message });
  }
});

// POST /api/maintenance
router.post("/", async (req, res) => {
  try {
    const { equipmentId, issueReported, downtimeHours, technicianId, status } = req.body;
    if (!equipmentId) {
      return res.status(400).json({ message: "equipmentId is required" });
    }

    const record = await Maintenance.create({
      equipmentId,
      issueReported: issueReported || "",
      downtimeHours: downtimeHours || 0,
      technicianId: technicianId || null,
      status: status || "pending",
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to create maintenance record", error: err.message });
  }
});

// PATCH /api/maintenance/:id
router.patch("/:id", async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Maintenance record not found" });

    const { status, technicianId, downtimeHours, issueReported } = req.body;

    if (status !== undefined) {
      record.status = status;
      if (status === "resolved" && !record.resolvedDate) {
        record.resolvedDate = new Date();
      }
      if (status !== "resolved") {
        record.resolvedDate = null;
      }
    }
    if (technicianId !== undefined) record.technicianId = technicianId;
    if (downtimeHours !== undefined) record.downtimeHours = downtimeHours;
    if (issueReported !== undefined) record.issueReported = issueReported;

    await record.save();
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to update maintenance record", error: err.message });
  }
});

module.exports = router;
