const NOTICE_HORIZON_DAYS = 90;
// Earnings can move the price sharply, so trades held across them carry extra risk
const EARNINGS_WARNING_DAYS = 21;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Earnings and ex-dividend dates from today up to 90 days ahead, nearest first
 * @param {{earningsDate: number|null, isEarningsDateEstimate: boolean, exDividendDate: number|null}|null} events - Dates in unix seconds
 * @param {Date} [now]
 * @returns {Array<{type: 'earnings'|'exDividend', timestamp: number, daysUntil: number, isEstimate: boolean, isWarning: boolean}>}
 */
export function getUpcomingEvents(events, now = new Date()) {
  if (!events) return [];

  const candidates = [
    { type: 'earnings', timestamp: events.earningsDate, isEstimate: events.isEarningsDateEstimate },
    { type: 'exDividend', timestamp: events.exDividendDate, isEstimate: false }
  ];

  return candidates
    .filter(event => event.timestamp != null)
    .map(event => {
      const daysUntil = calendarDaysBetween(now, new Date(event.timestamp * 1000));
      return { ...event, daysUntil, isWarning: event.type === 'earnings' && daysUntil <= EARNINGS_WARNING_DAYS };
    })
    .filter(event => event.daysUntil >= 0 && event.daysUntil <= NOTICE_HORIZON_DAYS)
    .sort((a, b) => a.timestamp - b.timestamp);
}

// Difference of the local calendar dates; rounding absorbs daylight saving shifts
function calendarDaysBetween(from, to) {
  const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
}
