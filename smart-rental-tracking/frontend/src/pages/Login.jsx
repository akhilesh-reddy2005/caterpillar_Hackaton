import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../services/auth.js";
import { getUser } from "../services/api.js";

const DEFAULT_IDS = {
  user: "USR001",
  admin: "ADM001",
  operator: "OPR001",
};

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function continueAs(role) {
    setError("");
    setLoading(true);
    const id = userId.trim() || DEFAULT_IDS[role];

    let name = id;
    try {
      const res = await getUser(id);
      name = res.data.name;
    } catch {
      // ok — allow login even if the user record is not found
      name = id;
    }

    saveSession({ role, userId: id, name });
    setLoading(false);

    if (role === "user") navigate("/user");
    else if (role === "admin") navigate("/admin");
    else navigate("/operator");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cat-black p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cat-yellow text-cat-black font-black px-3 py-2 rounded text-xl">
            CAT
          </div>
          <div>
            <h1 className="text-xl font-black leading-tight">
              SMART RENTAL TRACKING SYSTEM
            </h1>
            <p className="text-xs text-gray-500">Equipment rental management</p>
          </div>
        </div>

        <label className="block text-sm font-semibold mb-1">User ID (optional)</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. USR001"
          className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-cat-yellow"
        />

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="space-y-3">
          <button
            disabled={loading}
            onClick={() => continueAs("user")}
            className="w-full bg-cat-yellow text-cat-black font-bold py-3 rounded-lg hover:brightness-95 disabled:opacity-60"
          >
            Continue as User
          </button>
          <button
            disabled={loading}
            onClick={() => continueAs("admin")}
            className="w-full bg-cat-black text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-60"
          >
            Continue as Admin
          </button>
          <button
            disabled={loading}
            onClick={() => continueAs("operator")}
            className="w-full border-2 border-cat-black text-cat-black font-bold py-3 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          >
            Continue as Operator
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Demo IDs: USR001 (user), ADM001 (admin), OPR001 (operator)
        </p>
      </div>
    </div>
  );
}
