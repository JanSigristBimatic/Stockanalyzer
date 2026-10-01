export function MetricCard({ label, value, subValue, highlight }) {
  const borderClass = highlight === 'green'
    ? 'border-green-500/50'
    : highlight === 'red'
    ? 'border-red-500/50'
    : 'border-slate-600';

  const valueClass = highlight === 'green'
    ? 'text-green-400'
    : highlight === 'red'
    ? 'text-red-400'
    : 'text-white';

  return (
    <div className={`bg-slate-800 border ${borderClass} rounded-lg p-3`}>
      <div className="text-slate-400 text-xs font-semibold mb-1">{label}</div>
      <div className={`text-xl font-bold ${valueClass}`}>{value}</div>
      {subValue && <div className="text-xs text-slate-400 mt-1">{subValue}</div>}
    </div>
  );
}
