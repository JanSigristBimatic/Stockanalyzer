import { AlertTriangle } from 'lucide-react';

export function TradingTips() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        Wichtige Trading-Tipps
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-green-400 mb-2">DO's</h4>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>Nutze immer mehrere Indikatoren zur Bestätigung</li>
            <li>Setze Stop-Loss Orders zum Risikomanagement</li>
            <li>Warte auf klare Signale - Geduld zahlt sich aus</li>
            <li>Berücksichtige das Gesamtmarktumfeld</li>
            <li>Lerne aus vergangenen Trades</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="font-bold text-red-400 mb-2">DON'Ts</h4>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>Verlasse dich nicht auf einen einzigen Indikator</li>
            <li>Handle nicht gegen den Haupttrend</li>
            <li>Ignoriere nicht das Volumen</li>
            <li>Lass Emotionen nicht deine Entscheidungen steuern</li>
            <li>Überhandle nicht - Qualität vor Quantität</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
