import { Activity } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-20">
      <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <p className="text-slate-300 text-xl font-semibold">Gib ein Aktiensymbol ein</p>
      <p className="text-slate-400 mt-2">Beispiele: NVDA, AAPL, BABA, MSFT, GOOGL, AMZN, META, TSLA</p>
    </div>
  );
}
