import { useState } from "react";
import QRScanner from "./QRScanner.jsx";
import Badge from "./Badge.jsx";
import { validateScan, confirmPickup, confirmReturn } from "../services/api.js";

export default function AdminScanner({ onChange }) {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null); // validate response
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [operatorId, setOperatorId] = useState("");

  async function runValidate(id) {
    const theId = (id || bookingId).trim();
    if (!theId) return;
    setError("");
    setSuccess("");
    setResult(null);
    setLoading(true);
    try {
      const res = await validateScan(theId);
      if (!res.data.success) {
        setError(res.data.message);
      } else {
        setResult({ ...res.data, bookingId: theId });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Validation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function doPickup() {
    setLoading(true);
    setError("");
    try {
      await confirmPickup({
        bookingId: result.bookingId,
        siteId: siteId.trim() || undefined,
        operatorId: operatorId.trim() || undefined,
      });
      setSuccess("Pickup confirmed. Equipment is now active.");
      setResult(null);
      setBookingId("");
      setSiteId("");
      setOperatorId("");
      onChange && onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm pickup.");
    } finally {
      setLoading(false);
    }
  }

  async function doReturn() {
    setLoading(true);
    setError("");
    try {
      await confirmReturn(result.bookingId);
      setSuccess("Return confirmed. Equipment is now available.");
      setResult(null);
      setBookingId("");
      onChange && onChange();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm return.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-xl">
      <h3 className="font-bold mb-3">QR Scanner</h3>

      <QRScanner onResult={(text) => runValidate(text)} />

      <div className="mt-4">
        <label className="block text-sm font-semibold mb-1">
          Or enter Booking ID manually
        </label>
        <div className="flex gap-2">
          <input
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="BOOK-..."
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={() => runValidate()}
            disabled={loading}
            className="bg-cat-black text-white font-semibold px-4 rounded-lg disabled:opacity-60"
          >
            Validate
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-400 text-sm mt-3">Working…</p>}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mt-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm mt-3">
          {success}
        </div>
      )}

      {result && (
        <div className="border rounded-lg p-4 mt-4 text-sm space-y-3">
          <div>
            <p className="font-semibold">
              Booking {result.booking.bookingId}{" "}
              <Badge status={result.booking.qrStatus} />
            </p>
            <p className="text-gray-500">
              User: {result.booking.userId} · Payment:{" "}
              <Badge status={result.booking.paymentStatus} />
            </p>
          </div>

          {result.equipment && (
            <div>
              <p className="font-semibold">Equipment</p>
              <p className="text-gray-500">
                {result.equipment.equipmentId} — {result.equipment.type} · Site:{" "}
                {result.equipment.siteId || "—"}
              </p>
            </div>
          )}

          {result.operator && (
            <div>
              <p className="font-semibold">Assigned Operator</p>
              <p className="text-gray-500">
                {result.operator.name} ({result.operator.operatorId})
              </p>
            </div>
          )}

          {result.action === "confirm-pickup" && (
            <div className="space-y-2">
              <input
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                placeholder="Site ID (e.g. S003)"
                className="w-full border rounded-lg px-3 py-2"
              />
              {result.booking.operatorRequest === "self" && (
                <input
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="Operator ID (customer's own operator)"
                  className="w-full border rounded-lg px-3 py-2"
                />
              )}
              <button
                onClick={doPickup}
                disabled={loading}
                className="w-full bg-cat-yellow text-cat-black font-bold py-2 rounded-lg disabled:opacity-60"
              >
                Confirm Pickup
              </button>
            </div>
          )}

          {result.action === "confirm-return" && (
            <button
              onClick={doReturn}
              disabled={loading}
              className="w-full bg-cat-yellow text-cat-black font-bold py-2 rounded-lg disabled:opacity-60"
            >
              Confirm Return
            </button>
          )}
        </div>
      )}
    </div>
  );
}
