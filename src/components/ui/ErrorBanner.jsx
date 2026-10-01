import { AlertCircle } from 'lucide-react';

/**
 * Error shown above data that is still displayed from an earlier request
 */
export function ErrorBanner({ message }) {
  return (
    <div role="alert" className="mb-5 p-3 rounded-xl flex items-center gap-3 bg-red-900/40 border-2 border-red-600">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <span className="text-red-200 font-semibold">{message}</span>
    </div>
  );
}
