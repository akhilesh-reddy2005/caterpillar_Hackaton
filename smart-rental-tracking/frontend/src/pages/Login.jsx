import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../services/auth.js";
import { getUser } from "../services/api.js";
import { Spinner } from "../components/ui.jsx";
import Icon from "../components/Icon.jsx";

const DEFAULT_IDS = { user: "USR001", admin: "ADM001", operator: "OPR001" };

const ROLES = [
  {
    key: "user",
    title: "Continue as User",
    desc: "Browse the fleet, book equipment and manage your rentals.",
    icon: "cube",
  },
  {
    key: "admin",
    title: "Continue as Admin",
    desc: "Scan pickups & returns, track anomalies, maintenance and demand.",
    icon: "grid",
  },
  {
    key: "operator",
    title: "Continue as Operator",
    desc: "View your assignment status and how dispatch works.",
    icon: "users",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState("");

  async function continueAs(role) {
    setLoading(role);
    const id = userId.trim() || DEFAULT_IDS[role];
    let name = id;
    try {
      const res = await getUser(id);
      name = res.data.name;
    } catch {
      name = id;
    }
    saveSession({ role, userId: id, name });
    navigate(role === "user" ? "/user" : role === "admin" ? "/admin" : "/operator");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cat-dark text-white">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cat-yellow/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cat-yellow/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-9 text-center animate-fade-up">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-cat-yellow font-display text-lg font-extrabold text-cat-ink shadow-glow">
            CAT
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Smart Rental Tracking
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-stone-400">
            Equipment rental management for construction &amp; mining fleets —
            witnessed pickups, returns and utilisation insights.
          </p>
        </div>

        <div className="w-full max-w-md animate-fade-up rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            User ID <span className="text-stone-600">(optional)</span>
          </label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g. USR001"
            className="mb-5 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-500 outline-none transition focus:border-cat-yellow focus:ring-4 focus:ring-cat-yellow/10"
          />

          <div className="space-y-2.5">
            {ROLES.map((r) => (
              <button
                key={r.key}
                disabled={!!loading}
                onClick={() => continueAs(r.key)}
                className="group flex w-full items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-left transition-all hover:border-cat-yellow/40 hover:bg-white/[0.06] disabled:opacity-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cat-yellow/10 text-cat-yellow transition group-hover:bg-cat-yellow group-hover:text-cat-ink">
                  {loading === r.key ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <Icon name={r.icon} className="h-5 w-5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white">
                    {r.title}
                  </span>
                  <span className="block truncate text-xs text-stone-400">
                    {r.desc}
                  </span>
                </span>
                <Icon
                  name="scan"
                  className="hidden h-4 w-4 text-stone-600 transition group-hover:translate-x-0.5 group-hover:text-cat-yellow sm:block"
                />
              </button>
            ))}
          </div>

          <p className="mt-5 text-center text-[11px] text-stone-500">
            Demo IDs · USR001 · ADM001 · OPR001 — no password required
          </p>
        </div>
      </div>
    </div>
  );
}
