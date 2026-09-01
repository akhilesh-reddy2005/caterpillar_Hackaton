import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import AdminScanner from "../components/AdminScanner.jsx";
import EquipmentTable from "../components/EquipmentTable.jsx";
import AnomalyPanel from "../components/AnomalyPanel.jsx";
import MaintenancePanel from "../components/MaintenancePanel.jsx";
import DemandInsights from "../components/DemandInsights.jsx";
import OperatorTable from "../components/OperatorTable.jsx";
import ChatWidget from "../components/ChatWidget.jsx";
import { getContext } from "../services/api.js";
import { getSession } from "../services/auth.js";
import { displayStatus, getAnomalies } from "../utils/helpers.js";

const NAV = [
  "Dashboard",
  "QR Scanner",
  "Equipment",
  "Anomalies",
  "Maintenance",
  "Demand Insights",
  "Operators",
];

export default function AdminDashboard() {
  const session = getSession();
  const [tab, setTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState({
    equipment: [],
    bookings: [],
    operators: [],
    maintenance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await getContext();
      setData(res.data);
    } catch {
      setError("Could not load dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const anomalyCount = data.equipment.reduce(
    (n, eq) => n + getAnomalies(eq).length,
    0
  );
  const activeCount = data.equipment.filter(
    (eq) => displayStatus(eq) === "active"
  ).length;
  const overdueCount = data.equipment.filter(
    (eq) => displayStatus(eq) === "overdue"
  ).length;
  const pendingMaint = data.maintenance.filter(
    (m) => m.status !== "resolved"
  ).length;

  function pick(t) {
    setTab(t);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Smart Rental Tracking — Admin"
        name={session?.name}
        onMenu={() => setMenuOpen((o) => !o)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block w-full md:w-56 bg-cat-gray text-white md:min-h-[calc(100vh-56px)] absolute md:static z-10`}
        >
          <nav className="p-3 space-y-1">
            {NAV.map((n) => (
              <button
                key={n}
                onClick={() => pick(n)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  tab === n
                    ? "bg-cat-yellow text-cat-black"
                    : "hover:bg-white/10"
                }`}
              >
                {n}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 space-y-6">
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {loading && <p className="text-gray-400 text-sm">Loading…</p>}

          {tab === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Equipment" value={data.equipment.length} />
                <StatCard label="Active Rentals" value={activeCount} />
                <StatCard label="Overdue" value={overdueCount} tone="red" />
                <StatCard label="Open Anomalies" value={anomalyCount} tone="red" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-bold mb-2">Maintenance</h3>
                  <p className="text-sm text-gray-500">
                    {pendingMaint} open · {data.maintenance.length} total
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-bold mb-2">Operators</h3>
                  <p className="text-sm text-gray-500">
                    {
                      data.operators.filter(
                        (o) => o.availabilityStatus === "available"
                      ).length
                    }{" "}
                    available · {data.operators.length} total
                  </p>
                </div>
              </div>
              <AnomalyPanel equipment={data.equipment} />
            </div>
          )}

          {tab === "QR Scanner" && <AdminScanner onChange={load} />}

          {tab === "Equipment" && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">All Equipment</h2>
              <EquipmentTable equipment={data.equipment} />
            </div>
          )}

          {tab === "Anomalies" && <AnomalyPanel equipment={data.equipment} />}

          {tab === "Maintenance" && <MaintenancePanel />}

          {tab === "Demand Insights" && (
            <DemandInsights equipment={data.equipment} />
          )}

          {tab === "Operators" && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold">Operators</h2>
              <OperatorTable
                operators={data.operators}
                bookings={data.bookings}
              />
            </div>
          )}
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p
        className={`text-3xl font-black ${
          tone === "red" && value > 0 ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
