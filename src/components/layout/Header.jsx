import { Activity } from 'lucide-react';
import { BIMATIC_BLUE, BIMATIC_LIGHT } from '../../constants';

export function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Stock Analyzer Pro</h1>
          <p className="text-sm font-medium" style={{ color: BIMATIC_LIGHT }}>by Bimatic GmbH</p>
        </div>
      </div>
      <p className="text-slate-300 text-base font-medium">
        Technische Analyse mit Fibonacci, Support/Resistance & automatischem Trading-Fazit
      </p>
    </div>
  );
}
