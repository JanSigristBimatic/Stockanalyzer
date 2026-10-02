import { InfoTooltip } from '../../components/ui';
import { INDICATOR_INFO } from '../../constants';
import { formatPercent, toMainCurrency } from '../../utils/format';
import { formatBarTime } from './chartTheme';
import { INDICATOR_PANES, PRICE_OVERLAYS } from './chartLayers';

/**
 * Values of the bar under the crosshair: prices, active overlays and active indicator panes
 */
export function ChartLegend({ bar, previousBar, settings, priceFormats, interval, currency }) {
  const formatQuote = priceFormats.quote.formatter;
  const change = previousBar ? ((bar.close - previousBar.close) / previousBar.close) * 100 : null;

  return (
    <div className="space-y-1 mb-2 text-xs min-h-[2.5rem]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-slate-400 font-semibold">{formatBarTime(bar.timestamp, interval)}</span>
        <LegendValue label="E" value={formatValue(bar.open, formatQuote)} />
        <LegendValue label="H" value={formatValue(bar.high, formatQuote)} />
        <LegendValue label="T" value={formatValue(bar.low, formatQuote)} />
        <LegendValue label="S" value={formatValue(bar.close, formatQuote)} />
        {change != null && (
          <span className={`font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatPercent(change)}</span>
        )}
        <span className="text-slate-500">{toMainCurrency(currency)}</span>
        {PRICE_OVERLAYS.filter(overlay => settings[overlay.id]).flatMap(overlay => overlay.lines.map(line => (
          <LegendValue key={line.key} color={overlay.color} label={line.label} value={formatValue(bar[line.key], formatQuote)} />
        )))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {INDICATOR_PANES.filter(pane => settings[pane.id]).map(pane => (
          <span key={pane.id} className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">{pane.label}</span>
            {pane.series.map(series => (
              <LegendValue
                key={series.key}
                color={series.color ?? series.colorOf(bar)}
                label={pane.series.length > 1 ? series.label : null}
                value={formatValue(bar[series.key], priceFormats[series.format].formatter)}
              />
            ))}
            <InfoTooltip info={INDICATOR_INFO[pane.infoKey]} />
          </span>
        ))}
      </div>
    </div>
  );
}

function LegendValue({ label, value, color }) {
  return (
    <span className="flex items-center gap-1">
      {color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
      {label && <span className="text-slate-400">{label}</span>}
      <span className="text-white font-semibold tabular-nums">{value}</span>
    </span>
  );
}

function formatValue(value, formatter) {
  return Number.isFinite(value) ? formatter(value) : '–';
}
