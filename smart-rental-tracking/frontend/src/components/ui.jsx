// Tiny shared UI helpers used across pages.

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2Z"
      />
    </svg>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-stone-400">
      <Spinner className="h-4 w-4" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="card grid place-items-center px-6 py-14 text-center">
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-stone-100 text-stone-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-semibold text-stone-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-stone-400">{hint}</p>}
    </div>
  );
}

export function Alert({ tone = "error", children }) {
  const tones = {
    error: "bg-red-50 text-red-800 ring-red-600/15",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
    info: "bg-blue-50 text-blue-800 ring-blue-600/15",
  };
  return (
    <div className={`rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </div>
  );
}
