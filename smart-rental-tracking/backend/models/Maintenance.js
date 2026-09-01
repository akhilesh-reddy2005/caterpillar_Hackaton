const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  equipmentId: { type: String, required: true, ref: "Equipment" },
  issueReported: { type: String },
  reportedDate: { type: Date, default: Date.now },
  resolvedDate: { type: Date, default: null },
  downtimeHours: { type: Number, default: 0 },
  technicianId: { type: String, default: null },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
