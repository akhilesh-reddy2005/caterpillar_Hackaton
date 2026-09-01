import Badge from "./Badge.jsx";

export default function OperatorTable({ operators, bookings }) {
  function currentAssignment(operatorId) {
    const b = bookings.find(
      (bk) =>
        bk.assignedOperatorId === operatorId &&
        (bk.qrStatus === "unused" || bk.qrStatus === "checked-out")
    );
    if (!b) return null;
    return `${b.equipmentId} · ${b.bookingId}`;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="th">Operator</th>
              <th className="th">Name</th>
              <th className="th">Certified equipment</th>
              <th className="th">Availability</th>
              <th className="th">Current assignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {operators.map((op) => {
              const assignment = currentAssignment(op.operatorId);
              return (
                <tr key={op.operatorId} className="transition hover:bg-stone-50/70">
                  <td className="td font-display font-bold text-stone-900">
                    {op.operatorId}
                  </td>
                  <td className="td">{op.name}</td>
                  <td className="td">
                    <div className="flex flex-wrap gap-1">
                      {op.certifiedEquipmentTypes.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="td">
                    <Badge status={op.availabilityStatus} />
                  </td>
                  <td className="td text-stone-500">
                    {assignment || <span className="text-stone-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
