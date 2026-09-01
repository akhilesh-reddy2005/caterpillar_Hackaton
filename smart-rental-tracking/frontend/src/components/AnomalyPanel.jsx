import Badge from "./Badge.jsx";
import { getAnomalies } from "../utils/helpers.js";

export default function AnomalyPanel({ equipment }) {
  const cards = [];
  equipment.forEach((eq) => {
    getAnomalies(eq).forEach((a) => cards.push({ eq, ...a }));
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold">Anomaly Flags</h3>
        <span
          className="text-gray-400 text-xs cursor-help"
          title="This anomaly is meaningful because pickup and return dates are now witnessed by Admin QR scans rather than being self-reported."
        >
          ⓘ
        </span>
      </div>

      {cards.length === 0 ? (
        <p className="text-gray-400 text-sm">No anomalies detected.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4 border-l-4 border-red-400"
            >
              <div className="flex justify-between items-start">
                <p className="font-bold">{c.eq.equipmentId}</p>
                <Badge status={c.severity} label={c.severity} />
              </div>
              <p className="text-xs text-gray-500">{c.eq.type}</p>
              <p className="text-sm font-semibold mt-2 text-red-700">{c.type}</p>
              <p className="text-xs text-gray-600 mt-1">{c.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
