import { Activity, BarChart3, DollarSign, GraduationCap, Star, Radar } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';

export function TabNavigation({ activeTab, onTabChange, watchlistCount = 0 }) {
  const tabs = [
    { id: 'analyse', label: 'Analyse', icon: BarChart3 },
    { id: 'kennzahlen', label: 'Kennzahlen', icon: DollarSign },
    { id: 'charts', label: 'Charts', icon: Activity },
    { id: 'scanner', label: 'Auto-Scanner', icon: Radar },
    { id: 'watchlist', label: 'Watchlist', icon: Star, badge: watchlistCount },
    { id: 'lernen', label: 'Lernen', icon: GraduationCap }
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map(({ id, label, icon: Icon, badge }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === id ? 'text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
          style={activeTab === id ? { backgroundColor: BIMATIC_BLUE } : {}}
        >
          <Icon className="w-4 h-4" />
          {label}
          {badge > 0 && (
            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
