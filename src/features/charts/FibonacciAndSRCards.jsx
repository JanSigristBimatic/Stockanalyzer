import { Target, Shield, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../../utils/format';

export function FibonacciAndSRCards({ fibonacci, supportResistance, indicators, currency, priceHint }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Fibonacci Levels */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Fibonacci Retracements</h2>
        </div>
        <div className="space-y-2">
          {fibonacci?.levels.map((fib, i) => {
            const isNear = Math.abs(fib.price - indicators.lastPrice) / indicators.lastPrice < 0.02;
            return (
              <div
                key={i}
                className={`flex justify-between items-center p-2 rounded ${isNear ? 'bg-amber-900/40 border border-amber-500' : 'bg-slate-800'}`}
              >
                <span className="text-slate-300 font-medium">{fib.label}</span>
                <span className={`font-bold ${isNear ? 'text-amber-400' : 'text-white'}`}>{formatPrice(fib.price, currency, priceHint)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support & Resistance */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Support & Resistance</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-red-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Widerstände
            </div>
            {supportResistance?.resistance.length > 0 ? (
              supportResistance.resistance.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-red-900/30 rounded mb-1">
                  <span className="text-slate-300">Level {i + 1}</span>
                  <span className="text-white font-bold">{formatPrice(r.price, currency, priceHint)}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">Keine klaren Widerstände erkannt</div>
            )}
          </div>
          <div>
            <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Unterstützungen
            </div>
            {supportResistance?.support.length > 0 ? (
              supportResistance.support.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-green-900/30 rounded mb-1">
                  <span className="text-slate-300">Level {i + 1}</span>
                  <span className="text-white font-bold">{formatPrice(s.price, currency, priceHint)}</span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">Keine klaren Unterstützungen erkannt</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
