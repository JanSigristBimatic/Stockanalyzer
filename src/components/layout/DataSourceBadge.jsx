import { Wifi } from 'lucide-react';

export function DataSourceBadge({ dataInfo }) {
  return (
    <div className="mb-5 p-3 rounded-xl flex items-center gap-3 bg-green-900/50 border-2 border-green-600">
      <Wifi className="w-5 h-5 text-green-400" />
      <span className="text-green-200 font-bold">
        Live-Daten von {dataInfo?.exchange} in {dataInfo?.currency}
      </span>
    </div>
  );
}
