import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Badge from "../components/Badge.jsx";
import BookingModal from "../components/BookingModal.jsx";
import QRCard from "../components/QRCard.jsx";
import { getEquipment, getUserBookings } from "../services/api.js";
import { getSession } from "../services/auth.js";

export default function UserDashboard() {
  const session = getSession();
  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [eqRes, bkRes] = await Promise.all([
        getEquipment({ status: "available" }),
        getUserBookings(session.userId),
      ]);
      setEquipment(eqRes.data);
      setBookings(bkRes.data);
    } catch {
      setError("Could not load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="Smart Rental Tracking" name={session?.name} />

      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Available Equipment */}
        <section>
          <h2 className="text-lg font-bold mb-3">Available Equipment</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : equipment.length === 0 ? (
            <p className="text-gray-400 text-sm">No equipment available right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {equipment.map((eq) => (
                <div
                  key={eq.equipmentId}
                  className="bg-white rounded-xl shadow p-4 border-t-4 border-cat-yellow"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{eq.equipmentId}</h3>
                    <Badge status={eq.status} />
                  </div>
                  <p className="text-sm text-gray-600">{eq.type}</p>
                  <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                    <p>Site: {eq.siteId || "—"}</p>
                    <p>Engine hours/day: {eq.engineHoursPerDay}</p>
                    <p>Idle hours/day: {eq.idleHoursPerDay}</p>
                  </div>
                  <button
                    onClick={() => setSelected(eq)}
                    className="mt-3 w-full bg-cat-black text-white text-sm font-semibold py-2 rounded-lg hover:opacity-90"
                  >
                    Book Equipment
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <section>
          <h2 className="text-lg font-bold mb-3">My Bookings</h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 text-sm">You have no bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <QRCard key={b.booking.bookingId} data={b} />
              ))}
            </div>
          )}
        </section>
      </div>

      {selected && (
        <BookingModal
          equipment={selected}
          userId={session.userId}
          onClose={() => {
            setSelected(null);
            load();
          }}
          onBooked={load}
        />
      )}
    </div>
  );
}
