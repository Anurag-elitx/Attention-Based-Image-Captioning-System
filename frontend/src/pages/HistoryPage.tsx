import { useState, useEffect } from 'react';
import { Clock, Search, Trash2, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { captionApi } from '../api/caption';
import type { CaptionResponse } from '../types';

export function HistoryPage() {
  const [items, setItems] = useState<CaptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await captionApi.getHistory(0, 100);
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load caption history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await captionApi.deleteCaption(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert('Failed to delete caption record');
    }
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return 'https://picsum.photos/seed/default/400/300';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const apiBase = import.meta.env.VITE_API_URL || '';
    if (apiBase.startsWith('http')) {
      const origin = new URL(apiBase).origin;
      return `${origin}${path}`;
    }
    return path;
  };
  
  const filtered = items.filter(item => 
    item.caption_text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Clock className="text-primary-500" size={32} />
            Caption History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Review all the images you've generated captions for.
          </p>
        </div>
        
        <div className="relative w-full sm:w-72 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search captions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-slate-500 text-sm">Loading your caption history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4 rounded-xl text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center">
          <ImageIcon className="text-slate-400 dark:text-slate-600 mb-3" size={48} />
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No caption records found</p>
          <p className="text-slate-400 text-sm mt-1">Upload images on the home page to start generating your history!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <img 
                  src={getImageUrl(item.image_url)} 
                  alt="Uploaded preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if static file missing
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/400/300';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-red-500 text-white backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0" 
                  title="Delete record"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <p className="text-slate-900 dark:text-white font-medium line-clamp-2 mb-4 flex-grow">
                  "{item.caption_text}"
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                  <div className="flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-semibold">
                    <span>{(item.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
