import Badge from "./Badge.jsx";
import Icon from "./Icon.jsx";
import { getAnomalies } from "../utils/helpers.js";

const TONE = {
  UNASSIGNED: "border-l-amber-400",
  UNDERUTILIZED: "border-l-blue-400",
  "RENTAL INTEGRITY ISSUE": "border-l-red-400",
  "NEVER OPERATED": "border-l-red-400",
  "EXCESSIVE IDLE": "border-l-amber-400",
  "OPEN MAINTENANCE": "border-l-purple-400",
  "TELEMETRY OFFLINE": "border-l-red-400",
  "RENTAL OVERRUN": "border-l-red-400",
};

export default function AnomalyPanel({ equipment, telemetry = [], maintenance = [] }) {
  const telMap = {};
  telemetry.forEach((t) => {
    telMap[t.equipmentId] = t;
  });

  const cards = [];
  equipment.forEach((eq) => {
    getAnomalies(eq, { telemetry: telMap[eq.equipmentId], maintenance }).forEach((a) =>
      cards.push({ eq, ...a })
    );
  });

  const highCount = cards.filter((c) => c.severity === "high").length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="section-title">Anomaly Flags</h3>
        <span
          className="grid h-4 w-4 cursor-help place-items-center rounded-full bg-stone-200 text-[10px] font-bold text-stone-500"
          title="These anomalies are meaningful because usage is now verified — pickup/return are witnessed by Admin QR scans, and running hours come from a live machine heartbeat, not self-reported logs."
        >
          i
        </span>
        <span className="ml-auto text-sm text-stone-400">
          {cards.length} flag{cards.length === 1 ? "" : "s"}
          {highCount > 0 && ` · ${highCount} high`}
        </span>
      </div>

      {cards.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/15">
          <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
          No anomalies detected across the fleet.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`rounded-xl border border-stone-200 border-l-4 bg-white p-4 shadow-card ${
                TONE[c.type] || "border-l-stone-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-sm font-bold text-stone-900">
                    {c.eq.equipmentId}
                  </p>
                  <p className="text-xs text-stone-400">{c.eq.type}</p>
                </div>
                <Badge status={c.severity} />
              </div>
              <p className="mt-2.5 text-xs font-bold uppercase tracking-wide text-stone-700">
                {c.type}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">{c.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
