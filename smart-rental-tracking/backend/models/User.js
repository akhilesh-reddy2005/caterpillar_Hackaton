const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "operator"],
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
