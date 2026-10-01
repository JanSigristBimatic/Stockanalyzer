import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { InfoTooltip } from '../../components/ui';
import { INDICATOR_INFO } from '../../constants';

export function SignalItem({ signal }) {
  // Prüfe ob es ein Volumen-Signal ist
  const isVolumeSignal = signal.text?.includes('Volumen') || signal.text?.includes('OBV');

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg ${
        signal.type === 'bullish' ? 'bg-green-900/40' : signal.type === 'bearish' ? 'bg-red-900/40' : 'bg-slate-800'
      }`}
    >
      {signal.type === 'bullish' && <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />}
      {signal.type === 'bearish' && <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />}
      {signal.type === 'neutral' && <Scale className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
      <span className="text-white font-medium text-sm flex-1">{signal.text}</span>
      {isVolumeSignal && <InfoTooltip info={INDICATOR_INFO.volume} />}
    </div>
  );
}
