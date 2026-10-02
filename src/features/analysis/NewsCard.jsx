import { ExternalLink, Newspaper } from 'lucide-react';
import { useNews } from '../../hooks';
import { getNewsQuery } from '../../services';
import { formatTimeAgo } from '../../utils/format';

/**
 * Latest headlines for the symbol from Yahoo Finance, linking to the full articles
 */
export function NewsCard({ symbol, companyName }) {
  const { news, loading } = useNews(getNewsQuery(symbol, companyName));

  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">News</h2>
      </div>
      <NewsList news={news} loading={loading} />
    </div>
  );
}

function NewsList({ news, loading }) {
  if (loading) return <p className="text-slate-400 text-sm">News werden geladen...</p>;
  if (news == null) return <p className="text-slate-400 text-sm">News konnten nicht geladen werden.</p>;
  if (news.length === 0) return <p className="text-slate-400 text-sm">Keine aktuellen News gefunden.</p>;

  return (
    <ul className="divide-y divide-slate-800">
      {news.map(item => (
        <li key={item.id}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start justify-between gap-3 py-3"
          >
            <div>
              <div className="text-white font-semibold group-hover:text-blue-300">{item.title}</div>
              <div className="text-slate-400 text-xs mt-1">
                {[item.publisher, item.publishedAt != null && formatTimeAgo(item.publishedAt)].filter(Boolean).join(' · ')}
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-300 shrink-0 mt-1" />
          </a>
        </li>
      ))}
    </ul>
  );
}
