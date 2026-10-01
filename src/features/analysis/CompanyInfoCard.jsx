import { Globe, Building2 } from 'lucide-react';
import { BIMATIC_BLUE } from '../../constants';

export function CompanyInfoCard({ info }) {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">Unternehmensinformationen</h2>
      </div>
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
        <h3 className="text-2xl font-bold text-white mb-2">{info.name}</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          {info.sector && <InfoItem label="Sektor" value={info.sector} />}
          {info.industry && <InfoItem label="Branche" value={info.industry} />}
          {info.employees && <InfoItem label="Mitarbeiter" value={info.employees.toLocaleString('de-DE')} />}
        </div>
        {info.city && info.country && (
          <div className="mt-2 text-sm text-slate-400">{info.city}, {info.country}</div>
        )}
        {info.website && (
          <a
            href={info.website.startsWith('http') ? info.website : `https://${info.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-sm font-semibold flex items-center gap-1 hover:underline"
            style={{ color: BIMATIC_BLUE }}
          >
            <Globe className="w-4 h-4" />
            {info.website}
          </a>
        )}
      </div>
      {info.description && (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mt-4">
          <h4 className="text-white font-bold mb-2">Über das Unternehmen</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {info.description.length > 500 ? `${info.description.substring(0, 500)}...` : info.description}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-slate-400">{label}:</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
