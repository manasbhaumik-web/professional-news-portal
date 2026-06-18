import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Eye, BookMarked, ChevronRight, Sparkles } from 'lucide-react';
import { NewsArticle } from '../types';

interface ArticleCardProps {
  key?: React.Key;
  index?: number;
  art: NewsArticle;
  handleOpenArticle: (art: NewsArticle) => void;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  isCustomFeed?: boolean;
  failedImages?: string[];
  setFailedImages?: (f: any) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default React.memo(function ArticleCard({
  art,
  index,
  handleOpenArticle,
  toggleBookmark,
  isBookmarked,
  isCustomFeed = false,
  failedImages = [],
  setFailedImages
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  if (!art.imageUrl || imgError || failedImages.includes(art.id)) return null;

  let bentoClass = 'flex-col sm:flex-row';
  let imageClass = 'w-full sm:w-36 h-28 rounded-lg';
  let isHero = false;
  let isCompact = false;

  if (index !== undefined) {
    if (index % 5 === 0) {
      bentoClass = 'md:col-span-2 row-span-2 flex-col sm:flex-row items-stretch';
      imageClass = 'w-full sm:w-1/2 min-h-[200px] rounded-2xl';
      isHero = true;
    } else if (index % 5 === 3 || index % 5 === 4) {
      bentoClass = 'col-span-1 row-span-1 flex-col sm:flex-row items-start sm:items-center';
      imageClass = 'hidden sm:block w-20 h-20 rounded-xl';
      isCompact = true;
    } else {
      bentoClass = 'col-span-1 row-span-2 flex-col';
      imageClass = 'w-full h-48 rounded-2xl';
    }
  }

  return (
    <motion.article
      variants={itemVariants}
      onClick={() => handleOpenArticle(art)}
      className={`transition-all duration-300 group cursor-pointer flex gap-5 p-5 bg-portal-surface border border-portal-border hover:bg-portal-surface-hover shadow-sm hover:shadow-md transform rounded-3xl ${bentoClass}`}
    >
      {art.imageUrl && (
        <div className={`overflow-hidden shrink-0 relative bg-portal-bg ${imageClass}`}>
          <img
            src={art.imageUrl}
            alt={art.title}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            onError={() => {
              setImgError(true);
              if (setFailedImages) setFailedImages((prev: string[]) => [...prev, art.id]);
            }}
          />
          {art.trendsUp && !isCustomFeed && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 shadow-sm">
              <TrendingUp size={10} />
              <span>High Trends</span>
            </div>
          )}
          {isCustomFeed && (
            <div className="absolute top-2 left-2 bg-portal-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
              <Sparkles size={10} className="animate-pulse" />
              <span>Custom Brief</span>
            </div>
          )}
        </div>
      )}

      <div className={`flex-1 flex flex-col ${isHero ? 'justify-center' : ''} space-y-3`}>
        <header className="flex items-center justify-between text-[11px] font-mono uppercase">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-wider text-portal-accent">{art.category}</span>
            <span className="text-portal-text-muted">•</span>
            <span className="text-portal-text-muted line-clamp-1">{art.source}</span>
          </div>
          <span className="text-[10px] text-portal-text-muted shrink-0 ml-2 text-right">{art.timeAgo || art.date}</span>
        </header>

        <h4 className={`text-portal-text-main group-hover:text-portal-brand transition-colors font-serif font-bold leading-snug ${isHero ? 'text-2xl' : isCompact ? 'text-base' : 'text-xl'}`}>
          {art.title}
        </h4>

        {!isCompact && (
          <p className="text-sm line-clamp-3 leading-relaxed text-portal-text-muted">
            {art.summary}
          </p>
        )}

        <footer className="pt-2 flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center space-x-3 text-portal-text-muted">
            <span className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{art.readTime || '4 min read'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{art.views?.toLocaleString() || 400} views</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => toggleBookmark(art.id, e)}
              className="p-1 rounded hover:text-portal-text-main hover:bg-portal-bg text-portal-text-muted transition-colors"
              title="Bookmark article"
            >
              <BookMarked size={13} className={isBookmarked ? "text-yellow-500 fill-yellow-500" : ""} />
            </button>
            <span className="group-hover:translate-x-1 transition-transform inline-flex items-center font-bold text-portal-brand">
              Review {isCustomFeed ? 'custom briefing' : 'analysis'} <ChevronRight size={12} />
            </span>
          </div>
        </footer>
      </div>
    </motion.article>
  );
});
