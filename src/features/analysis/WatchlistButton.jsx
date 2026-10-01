import { Star } from 'lucide-react';

export function WatchlistButton({ symbol, isInWatchlist, onAdd, onRemove }) {
  if (isInWatchlist) {
    return (
      <button
        onClick={onRemove}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors"
      >
        <Star className="w-5 h-5 fill-current" />
        <span>{symbol} ist in deiner Watchlist</span>
        <span className="text-amber-200 text-sm ml-2">(Klicken zum Entfernen)</span>
      </button>
    );
  }

  return (
    <button
      onClick={onAdd}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-slate-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors group"
    >
      <Star className="w-5 h-5 group-hover:fill-current" />
      <span>Zur Watchlist hinzufügen</span>
    </button>
  );
}
