import Badge from "./Badge.jsx";

// operators: from GET /api/operators
// bookings: all bookings so we can show the current assignment
export default function OperatorTable({ operators, bookings }) {
  function currentAssignment(operatorId) {
    const b = bookings.find(
      (bk) =>
        bk.assignedOperatorId === operatorId &&
        (bk.qrStatus === "unused" || bk.qrStatus === "checked-out")
    );
    if (!b) return "—";
    return `${b.equipmentId} (${b.bookingId})`;
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Operator ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Certified Equipment</th>
            <th className="p-3">Availability</th>
            <th className="p-3">Current Assignment</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.operatorId} className="border-t">
              <td className="p-3 font-semibold">{op.operatorId}</td>
              <td className="p-3">{op.name}</td>
              <td className="p-3">{op.certifiedEquipmentTypes.join(", ")}</td>
              <td className="p-3">
                <Badge status={op.availabilityStatus} />
              </td>
              <td className="p-3">{currentAssignment(op.operatorId)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
