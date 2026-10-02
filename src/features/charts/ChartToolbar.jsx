import { INDICATOR_PANES, PRICE_LEVELS, PRICE_OVERLAYS } from './chartLayers';

const INDICATOR_COLOR = '#94a3b8';

/**
 * Toggles for the layers of the price pane and the indicator panes
 */
export function ChartToolbar({ settings, onToggle }) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 mb-3">
      <ToggleGroup label="Im Kurs" items={[...PRICE_OVERLAYS, ...PRICE_LEVELS]} settings={settings} onToggle={onToggle} />
      <ToggleGroup label="Indikatoren" items={INDICATOR_PANES} settings={settings} onToggle={onToggle} />
    </div>
  );
}

function ToggleGroup({ label, items, settings, onToggle }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide mr-1">{label}</span>
      {items.map(item => (
        <ToggleChip
          key={item.id}
          label={item.label}
          color={item.color ?? INDICATOR_COLOR}
          isActive={Boolean(settings[item.id])}
          onClick={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}

function ToggleChip({ label, color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
        isActive
          ? 'bg-slate-700 border-slate-500 text-white'
          : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'
      }`}
    >
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isActive ? color : 'transparent', border: `1px solid ${color}` }} />
      {label}
    </button>
  );
}
