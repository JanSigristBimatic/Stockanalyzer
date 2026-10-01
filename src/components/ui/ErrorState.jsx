import { AlertCircle } from 'lucide-react';

export function ErrorState({ error }) {
  return (
    <div className="text-center py-20">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-400 text-xl font-semibold">{error}</p>
      <p className="text-slate-400 mt-2">Versuche ein anderes Symbol oder überprüfe die Schreibweise.</p>
    </div>
  );
}
