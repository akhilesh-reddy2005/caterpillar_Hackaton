import Badge from "./Badge.jsx";

// Shows a booking confirmation + QR code image (data URL from backend).
export default function QRCard({ data }) {
  const { booking, equipment, operator, qrCode } = data;

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-1 text-sm">
          <p>
            <span className="text-gray-500">Booking ID:</span>{" "}
            <strong>{booking.bookingId}</strong>
          </p>
          <p>
            <span className="text-gray-500">Equipment:</span>{" "}
            {booking.equipmentId} {equipment ? `(${equipment.type})` : ""}
          </p>
          <p>
            <span className="text-gray-500">Payment:</span>{" "}
            <Badge status={booking.paymentStatus} />
          </p>
          <p>
            <span className="text-gray-500">Operator:</span>{" "}
            {operator
              ? `${operator.name} (${operator.operatorId})`
              : booking.operatorRequest === "self"
              ? "Own operator"
              : booking.assignedOperatorId || "—"}
          </p>
          <p>
            <span className="text-gray-500">Pickup status:</span>{" "}
            <Badge status={booking.qrStatus} />
          </p>
        </div>
        <div className="text-center">
          {qrCode ? (
            <img
              src={qrCode}
              alt="Booking QR code"
              className="w-40 h-40 mx-auto border rounded"
            />
          ) : (
            <div className="w-40 h-40 mx-auto border rounded flex items-center justify-center text-xs text-gray-400">
              No QR
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2 max-w-[10rem]">
            Show this QR code to Admin at pickup and return.
          </p>
        </div>
      </div>
    </div>
  );
}
