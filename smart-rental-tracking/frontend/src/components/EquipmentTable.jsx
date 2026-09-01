import { useState } from "react";
import Badge from "./Badge.jsx";
import { fmtDate, displayStatus } from "../utils/helpers.js";

const FILTERS = ["all", "available", "active", "overdue"];

export default function EquipmentTable({ equipment }) {
  const [filter, setFilter] = useState("all");

  const rows = equipment.filter(
    (eq) => filter === "all" || displayStatus(eq) === filter
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? "bg-cat-ink text-white"
                : "bg-white text-stone-500 ring-1 ring-inset ring-stone-200 hover:text-stone-800"
            }`}
          >
            {f}
            {f !== "all" && (
              <span className="ml-1.5 opacity-60">
                {equipment.filter((eq) => displayStatus(eq) === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="th">Equipment</th>
                <th className="th">Type</th>
                <th className="th">Site</th>
                <th className="th">Status</th>
                <th className="th">Check out</th>
                <th className="th">Expected return</th>
                <th className="th text-right">Engine h/d</th>
                <th className="th text-right">Idle h/d</th>
                <th className="th text-right">Op. days</th>
                <th className="th">Last operator</th>
                <th className="th">Operator source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((eq) => (
                <tr key={eq.equipmentId} className="transition hover:bg-stone-50/70">
                  <td className="td font-display font-bold text-stone-900">
                    {eq.equipmentId}
                  </td>
                  <td className="td">{eq.type}</td>
                  <td className="td">{eq.siteId || "—"}</td>
                  <td className="td">
                    <Badge status={displayStatus(eq)} />
                  </td>
                  <td className="td whitespace-nowrap">{fmtDate(eq.checkOutDate)}</td>
                  <td className="td whitespace-nowrap">{fmtDate(eq.checkInDate)}</td>
                  <td className="td text-right tabular-nums">{eq.engineHoursPerDay}</td>
                  <td className="td text-right tabular-nums">{eq.idleHoursPerDay}</td>
                  <td className="td text-right tabular-nums">{eq.operatingDays}</td>
                  <td className="td">{eq.lastOperatorId || "—"}</td>
                  <td className="td capitalize">
                    {eq.operatorSource ? eq.operatorSource.replace(/-/g, " ") : "—"}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="td py-10 text-center text-stone-400" colSpan={11}>
                    No equipment matches this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
