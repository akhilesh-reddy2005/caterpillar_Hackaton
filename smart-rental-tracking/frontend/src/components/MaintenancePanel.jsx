import { useState, useEffect } from "react";
import Badge from "./Badge.jsx";
import { fmtDate } from "../utils/helpers.js";
import { getMaintenance, updateMaintenance } from "../services/api.js";

const NEXT_STATUS = {
  pending: "in-progress",
  "in-progress": "resolved",
  resolved: "resolved",
};

export default function MaintenancePanel() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await getMaintenance(filter === "all" ? undefined : filter);
      setRecords(res.data);
    } catch {
      setError("Could not load maintenance records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function advance(rec) {
    const next = NEXT_STATUS[rec.status];
    if (next === rec.status) return;
    try {
      await updateMaintenance(rec._id, { status: next });
      load();
    } catch {
      setError("Failed to update record.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">Maintenance</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400 text-sm">No maintenance records.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Equipment</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Reported</th>
                <th className="p-3">Downtime (h)</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Status</th>
                <th className="p-3">Resolved</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3 font-semibold">{r.equipmentId}</td>
                  <td className="p-3">{r.issueReported}</td>
                  <td className="p-3">{fmtDate(r.reportedDate)}</td>
                  <td className="p-3">{r.downtimeHours}</td>
                  <td className="p-3">{r.technicianId || "—"}</td>
                  <td className="p-3">
                    <Badge status={r.status} />
                  </td>
                  <td className="p-3">{fmtDate(r.resolvedDate)}</td>
                  <td className="p-3">
                    {r.status !== "resolved" ? (
                      <button
                        onClick={() => advance(r)}
                        className="bg-cat-black text-white text-xs font-semibold px-3 py-1 rounded"
                      >
                        Mark {NEXT_STATUS[r.status]}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
