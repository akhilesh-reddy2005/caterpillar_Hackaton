const express = require("express");
const router = express.Router();

const Equipment = require("../models/Equipment");
const Maintenance = require("../models/Maintenance");
const Booking = require("../models/Booking");
const Operator = require("../models/Operator");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Same anomaly logic the Admin dashboard uses, computed here so answers are reliable.
function getAnomalies(eq) {
  const flags = [];
  if (eq.siteId === null || eq.lastOperatorId === null) {
    flags.push({ type: "UNASSIGNED", reason: "No site or no operator on record" });
  }
  const total = eq.engineHoursPerDay + eq.idleHoursPerDay;
  if (total > 0 && eq.idleHoursPerDay / total > 0.6) {
    flags.push({
      type: "UNDERUTILIZED",
      reason: `Idle ratio ${Math.round((eq.idleHoursPerDay / total) * 100)}%`,
    });
  }
  if (eq.checkOutDate && eq.checkInDate) {
    const days = Math.round(
      (new Date(eq.checkInDate) - new Date(eq.checkOutDate)) / 86400000
    );
    if (eq.operatingDays > days) {
      flags.push({
        type: "RENTAL INTEGRITY ISSUE",
        reason: `Operating days ${eq.operatingDays} exceed rental window ${days} days`,
      });
    }
  }
  return flags;
}

// POST /api/chat  { question }
router.post("/", async (req, res) => {
  try {
    const question = (req.body.question || "").trim();
    if (!question) {
      return res.status(400).json({ answer: "Please ask a question." });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.json({ answer: "Chatbot is not configured (GROQ_API_KEY missing)." });
    }

    const [equipment, maintenance, bookings, operators] = await Promise.all([
      Equipment.find().lean(),
      Maintenance.find().lean(),
      Booking.find().lean(),
      Operator.find().lean(),
    ]);

    const anomalies = equipment.flatMap((eq) =>
      getAnomalies(eq).map((a) => ({ equipmentId: eq.equipmentId, type: eq.type, ...a }))
    );

    const context = JSON.stringify({ equipment, maintenance, bookings, operators, anomalies });

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content:
              "You are the assistant for a Caterpillar equipment rental dashboard. " +
              "Answer ONLY from the JSON context provided. Be concise and specific — " +
              "cite equipment IDs, sites and operator IDs. If the context does not " +
              "contain the answer, say so.",
          },
          { role: "user", content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` },
        ],
      }),
    });

    if (!groqRes.ok) {
      const text = await groqRes.text();
      console.error("Groq error:", groqRes.status, text);
      return res
        .status(502)
        .json({ answer: `The AI service returned an error (${groqRes.status}).` });
    }

    const data = await groqRes.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "No answer returned.";
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Sorry, the assistant could not be reached." });
  }
});

module.exports = router;
