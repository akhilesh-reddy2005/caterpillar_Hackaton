import Header from "../components/Header.jsx";
import { getSession } from "../services/auth.js";

export default function OperatorPage() {
  const session = getSession();

  return (
    <div className="min-h-screen">
      <Header title="Smart Rental Tracking — Operator" name={session?.name} />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-2">Welcome, {session?.name}</h2>
          <p className="text-gray-600 text-sm mb-4">
            You are signed in as an <strong>Operator</strong>. Operators are
            assigned to equipment by Caterpillar when a customer requests an
            assigned operator, or brought directly by the customer.
          </p>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Your assignments are managed by the Admin team.</li>
            <li>
              When a booking is checked out via the Admin QR scan, your
              availability switches to <em>assigned</em>.
            </li>
            <li>
              When the equipment is returned, your availability switches back to{" "}
              <em>available</em>.
            </li>
          </ul>
          <p className="text-xs text-gray-400 mt-6">
            The core workflows in this demo are the User and Admin dashboards.
          </p>
        </div>
      </div>
    </div>
  );
}
