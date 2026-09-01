import { useState, useEffect } from "react";
import { getOperators, createBooking } from "../services/api.js";
import Badge from "./Badge.jsx";
import QRCard from "./QRCard.jsx";

export default function BookingModal({ equipment, userId, onClose, onBooked }) {
  const [operatorRequest, setOperatorRequest] = useState("caterpillar-assigned");
  const [operators, setOperators] = useState([]);
  const [loadingOps, setLoadingOps] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (operatorRequest !== "caterpillar-assigned") return;
    setLoadingOps(true);
    getOperators(equipment.type)
      .then((res) => setOperators(res.data))
      .catch(() => setOperators([]))
      .finally(() => setLoadingOps(false));
  }, [operatorRequest, equipment.type]);

  async function payNow() {
    setError("");
    setPaying(true);
    try {
      const res = await createBooking({
        userId,
        equipmentId: equipment.equipmentId,
        operatorRequest,
      });
      setConfirmation(res.data);
      onBooked && onBooked();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-30">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-bold">
            {confirmation ? "Booking Confirmed" : "Book Equipment"}
          </h2>
          <button onClick={onClose} className="text-gray-400 text-xl leading-none">
            ✕
          </button>
        </div>

        {!confirmation && (
          <>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <p>
                <strong>{equipment.equipmentId}</strong> — {equipment.type}
              </p>
              <p className="text-gray-500">
                Site: {equipment.siteId || "—"} · Engine {equipment.engineHoursPerDay}h/day ·
                Idle {equipment.idleHoursPerDay}h/day
              </p>
            </div>

            <p className="font-semibold text-sm mb-2">
              How would you like to operate this equipment?
            </p>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer">
                <input
                  type="radio"
                  checked={operatorRequest === "self"}
                  onChange={() => setOperatorRequest("self")}
                />
                <span className="text-sm">Bring my own operator</span>
              </label>
              <label className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer">
                <input
                  type="radio"
                  checked={operatorRequest === "caterpillar-assigned"}
                  onChange={() => setOperatorRequest("caterpillar-assigned")}
                />
                <span className="text-sm">Request Caterpillar operator</span>
              </label>
            </div>

            {operatorRequest === "caterpillar-assigned" && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">
                  Available operators certified for {equipment.type} (Caterpillar
                  assigns one automatically):
                </p>
                {loadingOps ? (
                  <p className="text-sm text-gray-400">Loading operators…</p>
                ) : operators.length === 0 ? (
                  <p className="text-sm text-red-600">
                    No certified operators available right now.
                  </p>
                ) : (
                  <ul className="text-sm border rounded-lg divide-y">
                    {operators.map((op) => (
                      <li
                        key={op.operatorId}
                        className="px-3 py-2 flex justify-between"
                      >
                        <span>
                          {op.name} ({op.operatorId})
                        </span>
                        <Badge status={op.availabilityStatus} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <button
              onClick={payNow}
              disabled={paying}
              className="w-full bg-cat-yellow text-cat-black font-bold py-3 rounded-lg hover:brightness-95 disabled:opacity-60"
            >
              {paying ? "Processing…" : "Pay Now (mock payment)"}
            </button>
          </>
        )}

        {confirmation && (
          <div className="space-y-4">
            <p className="text-green-700 text-sm font-semibold">
              Payment successful — your booking is confirmed.
            </p>
            <QRCard data={confirmation} />
            <button
              onClick={onClose}
              className="w-full bg-cat-black text-white font-bold py-2 rounded-lg"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
