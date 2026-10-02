import { CrosshairMode, TickMarkType } from 'lightweight-charts';

const LOCALE = 'de-CH';
const INTRADAY_INTERVALS = ['15m', '1h'];

const COLORS = {
  background: '#0f172a',
  text: '#cbd5e1',
  grid: '#1e293b',
  border: '#334155',
  label: '#334155'
};

const dateFormat = new Intl.DateTimeFormat(LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
});

// Chart times are UTC timestamps; tick marks and labels show them in local time
const tickMarkFormats = {
  [TickMarkType.Year]: new Intl.DateTimeFormat(LOCALE, { year: 'numeric' }),
  [TickMarkType.Month]: new Intl.DateTimeFormat(LOCALE, { month: 'short' }),
  [TickMarkType.DayOfMonth]: new Intl.DateTimeFormat(LOCALE, { day: 'numeric' }),
  [TickMarkType.Time]: new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }),
  [TickMarkType.TimeWithSeconds]: new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
};

export const CANDLE_COLORS = { up: '#22c55e', down: '#ef4444' };

/**
 * Formats a bar time for the crosshair label and the legend
 * @param {number} timestamp - Unix seconds
 * @param {string} interval - Bar interval
 * @returns {string}
 */
export function formatBarTime(timestamp, interval) {
  const format = INTRADAY_INTERVALS.includes(interval) ? dateTimeFormat : dateFormat;
  return format.format(new Date(timestamp * 1000));
}

/**
 * Options shared by all charts of the app: dark theme, local time labels and resizing with the container
 * @param {Object} params
 * @param {string} params.interval - Bar interval, intraday intervals show times on the axis
 * @param {boolean} [params.interactive=true] - false disables scrolling and zooming, e.g. for compact charts
 */
export function createChartOptions({ interval, interactive = true }) {
  return {
    autoSize: true,
    layout: {
      background: { type: 'solid', color: COLORS.background },
      textColor: COLORS.text,
      fontFamily: 'Roboto, system-ui, -apple-system, sans-serif',
      fontSize: 11,
      panes: { separatorColor: COLORS.border, separatorHoverColor: '#475569', enableResize: interactive }
    },
    grid: {
      vertLines: { color: COLORS.grid },
      horzLines: { color: COLORS.grid }
    },
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: { labelBackgroundColor: COLORS.label },
      horzLine: { labelBackgroundColor: COLORS.label }
    },
    rightPriceScale: { borderColor: COLORS.border },
    timeScale: {
      borderColor: COLORS.border,
      timeVisible: INTRADAY_INTERVALS.includes(interval),
      secondsVisible: false,
      fixLeftEdge: true,
      rightOffset: 3,
      tickMarkFormatter: (time, tickMarkType) => tickMarkFormats[tickMarkType].format(new Date(time * 1000))
    },
    localization: {
      locale: LOCALE,
      timeFormatter: (time) => formatBarTime(time, interval)
    },
    // Vertical swipes keep scrolling the page on touch devices
    handleScroll: interactive && { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: false },
    handleScale: interactive
  };
}
