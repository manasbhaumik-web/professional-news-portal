import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Flame, Activity } from 'lucide-react';
import { NewsArticle } from '../types';
import ArticleCard from './ArticleCard';
import { formatLocalTime } from '../utils/formatLocalTime';


interface TopNewsSectionProps {
  handleOpenArticle: (art: NewsArticle) => void;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  bookmarks: string[];
  failedImages: string[];
  setFailedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const TopNewsSection: React.FC<TopNewsSectionProps> = ({
  handleOpenArticle,
  toggleBookmark,
  bookmarks,
  failedImages,
  setFailedImages
}) => {
  const [topArticles, setTopArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch('/api/news/top');
        if (res.ok) {
          const data = await res.json();
          setTopArticles(data);
        }
      } catch (err) {
        console.error("Failed to fetch top news", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8 text-portal-text-muted animate-pulse">
        <Activity size={20} className="mr-2" />
        <span className="font-mono text-sm">CALCULATING IMPORTANCE VECTORS...</span>
      </div>
    );
  }

  if (topArticles.length === 0) return null;

  return (
    <div className="mb-10 w-full">
      <div className="flex items-center mb-6 pb-2 border-b-2 border-portal-border">
        <Flame className="text-portal-accent mr-3 animate-pulse" size={24} />
        <h2 className="text-2xl font-bold font-serif tracking-tight text-portal-text">Top News</h2>
        <span className="ml-4 font-mono text-xs text-portal-text-muted bg-portal-surface px-2 py-1 rounded">ALGORITHMICALLY CURATED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {topArticles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative rounded-xl overflow-hidden border border-portal-border/30 bg-portal-surface shadow-xl hover:shadow-2xl hover:border-portal-accent/50 transition-all duration-300 ${idx === 0 ? 'md:col-span-2 xl:col-span-3' : ''}`}
            onClick={() => handleOpenArticle(article)}
          >
            {/* Importance Score Badge */}
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
              <div className="bg-black/80 backdrop-blur-md text-portal-accent font-mono text-xs font-bold px-3 py-1.5 rounded-full border border-portal-accent/30 shadow-lg flex items-center">
                <Activity size={12} className="mr-1.5 animate-pulse" />
                SCORE: {(article.importance_score || 0).toFixed(1)}
              </div>
              {article.source_count && article.source_count > 1 && (
                <div className="bg-black/70 backdrop-blur-md text-white font-mono text-[10px] px-2 py-1 rounded flex items-center border border-white/10">
                  <Newspaper size={10} className="mr-1" />
                  {article.source_count} SOURCES
                </div>
              )}
            </div>

            {/* If index 0, render a larger hero card */}
            {idx === 0 ? (
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/3 h-64 md:h-auto relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-portal-bg via-portal-bg/40 to-transparent z-10" />
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center relative z-20 bg-portal-surface">
                  <span className="text-portal-accent font-mono text-xs font-semibold mb-3 tracking-widest uppercase">
                    {article.category} • {article.source}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold font-serif mb-4 leading-tight group-hover:text-portal-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-portal-text-muted text-sm line-clamp-4 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full cursor-pointer group">
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-portal-bg/90 to-transparent z-10" />
                  <img
                    src={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-4 z-20 text-portal-accent font-mono text-[10px] font-bold tracking-wider uppercase">
                    {article.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold font-serif leading-snug mb-3 group-hover:text-portal-accent transition-colors line-clamp-3">
                    {article.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-portal-text-muted/60 text-xs font-mono">
                    <span>{article.source}</span>
                    <span>{article.timeAgo || new Date(article.publishedAt || article.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopNewsSection;
