import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import SkeletonArticleCard from '../components/SkeletonArticleCard';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SportsPageProps {
  theme: 'dark' | 'light' | 'sepia';
  articles: NewsArticle[];
  selectedSportFromMenu: string;
  handleOpenArticle: (art: NewsArticle) => void;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  bookmarks: string[];
}

const timeAgo = (dateStr: string) => {
  // Ensure the date is parsed as UTC to prevent local timezone offsets from artificially aging the articles
  let parsedDateStr = dateStr;
  if (!dateStr.includes('T') && !dateStr.includes('Z')) {
    parsedDateStr = dateStr.replace(' ', 'T') + 'Z';
  }
  
  const diff = Date.now() - new Date(parsedDateStr).getTime();
  const mins = Math.floor(diff / 60000);
  
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function SportsPage({ articles, selectedSportFromMenu, handleOpenArticle, toggleBookmark, bookmarks }: SportsPageProps) {
  const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://www.espncricinfo.com/rss/content/story/feeds/0.xml');
        const data = await res.json();
        
        if (data.status === 'ok' && data.items) {
          const mappedArticles: NewsArticle[] = data.items.map((item: any, idx: number) => ({
            id: `live-cric-${idx}`,
            title: item.title,
            summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
            content: item.content || item.description || '',
            imageUrl: item.enclosure?.link || item.thumbnail || `https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
            category: 'Sports',
            sportName: 'Cricket',
            author: item.author || 'ESPN Cricinfo',
            timeAgo: item.pubDate ? timeAgo(item.pubDate) : 'Live',
            readTime: '3 min read',
            url: item.link
          }));
          
          setLiveArticles(mappedArticles);
        } else {
          setError('Failed to parse live cricket feed from external server.');
        }
      } catch (err) {
        setError('Connection error. Could not establish live cricket uplink.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveNews();
  }, []);

  const displayArticles = selectedSportFromMenu === 'All' 
    ? [...liveArticles, ...articles] 
    : selectedSportFromMenu === 'Cricket' 
      ? [...liveArticles, ...articles.filter(art => art.sportName === 'Cricket')]
      : articles.filter(art => art.sportName === selectedSportFromMenu);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b pb-2 border-portal-border">
        <div className="flex items-center space-x-3">
          <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
            {selectedSportFromMenu === 'All' ? 'Global Sports Feed' : `${selectedSportFromMenu} Feed`}
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50 flex items-center gap-1.5">
            {isLoading ? <RefreshCw size={10} className="animate-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
            {displayArticles.length} updates
          </span>
        </div>
        <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
          <Trophy size={12} className="text-yellow-500" />
          <span className="hidden sm:inline">Live Sports Radar</span>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-xs rounded-xl font-mono text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonArticleCard key={`skel-${i}`} index={i} />
            ))
          ) : displayArticles.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 border border-dashed text-center text-xs rounded-xl font-mono border-portal-border text-portal-text-muted col-span-full">
              No sports intelligence available for {selectedSportFromMenu}.
            </motion.div>
          ) : (
            displayArticles.map((art, idx) => (
              <ArticleCard
                key={art.id}
                index={idx}
                art={art}
                handleOpenArticle={handleOpenArticle}
                toggleBookmark={toggleBookmark}
                isBookmarked={bookmarks.includes(art.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
