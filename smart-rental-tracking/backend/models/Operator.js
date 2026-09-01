const mongoose = require("mongoose");

const operatorSchema = new mongoose.Schema({
  operatorId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  certifiedEquipmentTypes: { type: [String], default: [] },
  availabilityStatus: {
    type: String,
    enum: ["available", "assigned"],
    default: "available",
  },
});

module.exports = mongoose.model("Operator", operatorSchema);
