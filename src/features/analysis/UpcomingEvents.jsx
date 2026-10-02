import { AlertTriangle, CalendarDays } from 'lucide-react';
import { getUpcomingEvents } from '../../utils/upcomingEvents';
import { formatDate, formatDaysFromToday } from '../../utils/format';

const EVENT_LABELS = {
  earnings: 'Quartalszahlen',
  exDividend: 'Ex-Dividende'
};

/**
 * Upcoming earnings and ex-dividend dates; earnings within three weeks are highlighted as a risk
 */
export function UpcomingEvents({ events }) {
  const upcoming = getUpcomingEvents(events);
  if (upcoming.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {upcoming.map(event => (
        <EventNotice key={event.type} event={event} />
      ))}
    </div>
  );
}

function EventNotice({ event }) {
  const Icon = event.isWarning ? AlertTriangle : CalendarDays;
  const style = event.isWarning
    ? 'bg-amber-900/40 border-amber-500 text-amber-200'
    : 'bg-slate-800 border-slate-600 text-slate-200';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-semibold ${style}`}
      title={event.isWarning ? 'Um Quartalszahlen schwanken Kurse oft stark. Stop und Positionsgrösse prüfen.' : undefined}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>
        {EVENT_LABELS[event.type]} {formatDaysFromToday(event.daysUntil)} ({formatDate(event.timestamp)}
        {event.isEstimate && ', geschätzt'})
      </span>
    </div>
  );
}
