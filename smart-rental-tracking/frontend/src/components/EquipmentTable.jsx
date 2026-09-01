import Badge from "./Badge.jsx";
import { fmtDate, displayStatus } from "../utils/helpers.js";

export default function EquipmentTable({ equipment }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Equipment ID</th>
            <th className="p-3">Type</th>
            <th className="p-3">Site</th>
            <th className="p-3">Status</th>
            <th className="p-3">Check Out</th>
            <th className="p-3">Expected Return</th>
            <th className="p-3">Engine h/day</th>
            <th className="p-3">Idle h/day</th>
            <th className="p-3">Op. Days</th>
            <th className="p-3">Last Operator</th>
            <th className="p-3">Operator Source</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq) => (
            <tr key={eq.equipmentId} className="border-t">
              <td className="p-3 font-semibold">{eq.equipmentId}</td>
              <td className="p-3">{eq.type}</td>
              <td className="p-3">{eq.siteId || "—"}</td>
              <td className="p-3">
                <Badge status={displayStatus(eq)} />
              </td>
              <td className="p-3">{fmtDate(eq.checkOutDate)}</td>
              <td className="p-3">{fmtDate(eq.checkInDate)}</td>
              <td className="p-3">{eq.engineHoursPerDay}</td>
              <td className="p-3">{eq.idleHoursPerDay}</td>
              <td className="p-3">{eq.operatingDays}</td>
              <td className="p-3">{eq.lastOperatorId || "—"}</td>
              <td className="p-3">{eq.operatorSource || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
