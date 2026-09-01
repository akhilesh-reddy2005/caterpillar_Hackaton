import Icon from "./Icon.jsx";

const TYPES = ["Excavator", "Crane", "Bulldozer", "Grader"];

export default function DemandInsights({ equipment }) {
  const counts = {};
  const avgDays = {};
  TYPES.forEach((t) => {
    const list = equipment.filter((e) => e.type === t);
    counts[t] = list.length;
    const total = list.reduce((s, e) => s + (e.operatingDays || 0), 0);
    avgDays[t] = list.length ? Math.round(total / list.length) : 0;
  });

  const maxCount = Math.max(1, ...Object.values(counts));
  const maxAvg = Math.max(1, ...Object.values(avgDays));

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="chart" className="h-4 w-4 text-stone-400" />
          <h3 className="section-title">Fleet composition by type</h3>
        </div>
        <div className="space-y-3.5">
          {TYPES.map((t) => (
            <div key={t} className="flex items-center gap-4">
              <span className="w-24 shrink-0 text-sm font-medium text-stone-600">
                {t}
              </span>
              <div className="h-7 flex-1 overflow-hidden rounded-lg bg-stone-100">
                <div
                  className="flex h-full items-center justify-end rounded-lg bg-cat-yellow pr-2.5 text-xs font-bold text-cat-ink transition-all"
                  style={{ width: `${Math.max(12, (counts[t] / maxCount) * 100)}%` }}
                >
                  {counts[t]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="section-title mb-3">Average operating days per rental</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <div key={t} className="card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                {t}
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-stone-900">
                {avgDays[t]}
                <span className="ml-1 text-sm font-semibold text-stone-400">days</span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-cat-ink"
                  style={{ width: `${(avgDays[t] / maxAvg) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
