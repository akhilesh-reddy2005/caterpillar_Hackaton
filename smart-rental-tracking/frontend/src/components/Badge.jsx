// Small status badge. Pass a status string; it picks a colour.
const COLORS = {
  available: "bg-green-100 text-green-800",
  active: "bg-blue-100 text-blue-800",
  overdue: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  refunded: "bg-gray-200 text-gray-700",
  unused: "bg-gray-200 text-gray-700",
  "checked-out": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  assigned: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-200 text-gray-700",
};

export default function Badge({ status, label }) {
  const cls = COLORS[status] || "bg-gray-200 text-gray-700";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${cls}`}
    >
      {label || status}
    </span>
  );
}
