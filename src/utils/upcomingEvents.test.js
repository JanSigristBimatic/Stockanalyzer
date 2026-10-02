import { describe, it, expect } from 'vitest';
import { getUpcomingEvents } from './upcomingEvents';

// Noon UTC keeps the local calendar date stable across European and American time zones
const at = (isoDate) => Date.parse(`${isoDate}T12:00:00Z`) / 1000;
const NOW = new Date(at('2026-10-02') * 1000);

describe('getUpcomingEvents', () => {
  it('lists upcoming events nearest first with the days until', () => {
    const events = { earningsDate: at('2026-10-29'), isEarningsDateEstimate: false, exDividendDate: at('2026-10-12') };
    expect(getUpcomingEvents(events, NOW)).toEqual([
      { type: 'exDividend', timestamp: at('2026-10-12'), daysUntil: 10, isEstimate: false, isWarning: false },
      { type: 'earnings', timestamp: at('2026-10-29'), daysUntil: 27, isEstimate: false, isWarning: false }
    ]);
  });

  it('warns about earnings within 21 days, including today', () => {
    const inThreeWeeks = getUpcomingEvents({ earningsDate: at('2026-10-23'), isEarningsDateEstimate: true, exDividendDate: null }, NOW);
    expect(inThreeWeeks[0]).toMatchObject({ daysUntil: 21, isEstimate: true, isWarning: true });

    const today = getUpcomingEvents({ earningsDate: at('2026-10-02'), isEarningsDateEstimate: false, exDividendDate: null }, NOW);
    expect(today[0]).toMatchObject({ daysUntil: 0, isWarning: true });
  });

  it('skips past dates and dates beyond 90 days', () => {
    const events = { earningsDate: at('2026-07-30'), isEarningsDateEstimate: false, exDividendDate: at('2027-01-05') };
    expect(getUpcomingEvents(events, NOW)).toEqual([]);
  });

  it('handles missing dates and missing events', () => {
    expect(getUpcomingEvents({ earningsDate: null, isEarningsDateEstimate: false, exDividendDate: null }, NOW)).toEqual([]);
    expect(getUpcomingEvents(null, NOW)).toEqual([]);
  });
});
