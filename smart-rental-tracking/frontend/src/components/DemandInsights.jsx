export default function DemandInsights({ equipment }) {
  const types = ["Excavator", "Crane", "Bulldozer", "Grader"];

  const counts = {};
  const avgDays = {};
  types.forEach((t) => {
    const list = equipment.filter((e) => e.type === t);
    counts[t] = list.length;
    const total = list.reduce((s, e) => s + (e.operatingDays || 0), 0);
    avgDays[t] = list.length ? Math.round(total / list.length) : 0;
  });

  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-3">Equipment Count by Type</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <div key={t} className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">{t}</p>
              <p className="text-3xl font-black">{counts[t]}</p>
              <div className="h-2 bg-gray-100 rounded mt-2">
                <div
                  className="h-2 bg-cat-yellow rounded"
                  style={{ width: `${(counts[t] / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-3">Average Operating Days by Type</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <div key={t} className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">{t}</p>
              <p className="text-3xl font-black">{avgDays[t]}</p>
              <p className="text-xs text-gray-400">days / rental</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
