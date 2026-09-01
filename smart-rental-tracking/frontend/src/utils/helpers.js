// Client-side computed helpers used by the Admin dashboard.

export function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

// Overdue is computed client-side: active + expected return date is in the past.
export function displayStatus(eq) {
  if (eq.status === "active" && eq.checkInDate && new Date(eq.checkInDate) < new Date()) {
    return "overdue";
  }
  if (eq.status === "active") return "active";
  return eq.status; // available
}

// Returns a list of anomaly objects for one equipment record.
export function getAnomalies(eq) {
  const flags = [];

  // 1. Unassigned
  if (eq.siteId === null || eq.lastOperatorId === null) {
    flags.push({
      type: "UNASSIGNED",
      reason: "No site assigned or no operator on record.",
      severity: "medium",
    });
  }

  // 2. Underutilized
  const totalHours = eq.engineHoursPerDay + eq.idleHoursPerDay;
  if (totalHours > 0) {
    const idleRatio = eq.idleHoursPerDay / totalHours;
    if (idleRatio > 0.6) {
      flags.push({
        type: "UNDERUTILIZED",
        reason: `Idle ratio ${(idleRatio * 100).toFixed(0)}% (idle ${eq.idleHoursPerDay}h vs engine ${eq.engineHoursPerDay}h per day).`,
        severity: "high",
      });
    }
  }

  // 3. Rental integrity
  if (eq.checkOutDate && eq.checkInDate) {
    const ms = new Date(eq.checkInDate) - new Date(eq.checkOutDate);
    const windowDays = Math.round(ms / (1000 * 60 * 60 * 24));
    if (eq.operatingDays > windowDays) {
      flags.push({
        type: "RENTAL INTEGRITY ISSUE",
        reason: `Operating days (${eq.operatingDays}) exceed the rental window (${windowDays} days).`,
        severity: "high",
      });
    }
  }

  return flags;
}
