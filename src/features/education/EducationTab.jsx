import { BarChart3, DollarSign, GraduationCap } from 'lucide-react';
import { EducationCard } from '../../components/ui';
import { BIMATIC_BLUE, INDICATOR_INFO, FUNDAMENTAL_INFO } from '../../constants';
import { TradingTips } from './TradingTips';

export function EducationTab({ expandedCards, toggleCard }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/50 border-2 border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BIMATIC_BLUE }}>
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Aktienanalyse verstehen</h2>
            <p className="text-slate-400">Lerne technische Indikatoren und fundamentale Kennzahlen zu interpretieren</p>
          </div>
        </div>
        <p className="text-slate-300">
          Erfolgreiche Anleger nutzen sowohl technische Analyse (Charts, Indikatoren) als auch fundamentale Analyse (Kennzahlen, Bewertung).
          Klicke auf die Karten unten, um mehr über jeden Begriff zu erfahren.
        </p>
      </div>

      {/* Fundamentale Kennzahlen */}
      <div className="bg-slate-900/50 border-2 border-amber-600/50 rounded-xl p-4 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Fundamentale Kennzahlen</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Diese Kennzahlen zeigen die finanzielle Gesundheit und Bewertung eines Unternehmens.
        </p>
      </div>
      <div className="grid gap-4">
        {Object.entries(FUNDAMENTAL_INFO).map(([key, info]) => (
          <EducationCard key={`fund-${key}`} info={info} isExpanded={expandedCards[`fund-${key}`]} onToggle={() => toggleCard(`fund-${key}`)} />
        ))}
      </div>

      {/* Technische Indikatoren */}
      <div className="bg-slate-900/50 border-2 border-cyan-600/50 rounded-xl p-4 mb-2 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Technische Indikatoren</h3>
        </div>
        <p className="text-slate-400 text-sm">
          Diese Indikatoren helfen dir, Preisbewegungen und Trends in Charts zu analysieren.
        </p>
      </div>
      <div className="grid gap-4">
        {Object.entries(INDICATOR_INFO).map(([key, info]) => (
          <EducationCard key={key} info={info} isExpanded={expandedCards[key]} onToggle={() => toggleCard(key)} />
        ))}
      </div>

      <TradingTips />
      <EducationDisclaimer />
    </div>
  );
}

function EducationDisclaimer() {
  return (
    <div className="bg-amber-900/20 border border-amber-600/50 rounded-xl p-4 mt-4">
      <p className="text-amber-200 text-sm text-center">
        <strong>Hinweis:</strong> Diese Informationen dienen nur zu Bildungszwecken. Technische Analyse garantiert keine Gewinne.
        Investiere nur Geld, das du bereit bist zu verlieren, und konsultiere ggf. einen Finanzberater.
      </p>
    </div>
  );
}
