const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ userId: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// GET /api/users/:userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

module.exports = router;
