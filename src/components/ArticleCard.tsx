import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Eye, BookMarked, ChevronRight, Sparkles, Flame, Activity, Newspaper } from 'lucide-react';
import { NewsArticle } from '../types';
import { BrandLogoPlaceholder } from './BrandLogoPlaceholder';

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
  minimal?: boolean;
}

const itemVariants: any = {
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
  setFailedImages,
  minimal = false
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  const hasMissingImage = !art.imageUrl || imgError || (failedImages && failedImages.includes(art.id));

  // Determine domain for brand logo fallback
  const getDomain = (url?: string) => {
    if (!url) return null;
    try {
      return new URL(url).hostname;
    } catch (e) {
      return null;
    }
  };
  const domain = getDomain(art.originalUrl);
  const brandLogoUrl = domain ? `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=128` : null;

  let bentoClass = 'flex-col sm:flex-row';
  let imageClass = 'w-full sm:w-36 h-28 ';
  let isHero = false;
  let isCompact = false;

  if (index !== undefined) {
    if (index % 5 === 0) {
      bentoClass = 'md:col-span-2 row-span-2 flex-col sm:flex-row items-stretch';
      imageClass = 'w-full sm:w-1/2 min-h-[200px] ';
      isHero = true;
    } else if (index % 5 === 3 || index % 5 === 4) {
      bentoClass = 'col-span-1 row-span-1 flex-col sm:flex-row items-start sm:items-center';
      imageClass = 'hidden sm:block w-20 h-20 ';
      isCompact = true;
    } else {
      bentoClass = 'col-span-1 row-span-2 flex-col';
      imageClass = 'w-full h-48 ';
    }
  }

  if (minimal) {
    bentoClass = 'flex-row items-center';
    imageClass = 'w-24 h-24 sm:w-28 sm:h-28 ';
  }

  return (
    <motion.article
      variants={itemVariants}
      onClick={() => handleOpenArticle(art)}
      className={`transition-all duration-300 group cursor-pointer flex gap-5 p-5 bg-portal-surface border border-portal-border hover:bg-portal-surface-hover shadow-sm hover:shadow-xl hover:-translate-y-1 transform h-full ${bentoClass}`}
    >
      <div className={`overflow-hidden shrink-0 relative bg-portal-bg flex items-center justify-center ${imageClass}`}>
        {!hasMissingImage ? (
          <img
            src={art.imageUrl}
            alt={art.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              setImgError(true);
              if (setFailedImages) setFailedImages((prev: string[]) => [...prev, art.id]);
            }}
          />
        ) : (
          <BrandLogoPlaceholder article={art} iconSizeClass={minimal ? "w-10 h-10" : "w-16 h-16"} />
        )}

        {art.trendsUp && !isCustomFeed && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-0.5 shadow-sm">
            <TrendingUp size={10} />
            <span>High Trends</span>
          </div>
        )}
        {isCustomFeed && (
          <div className="absolute top-2 left-2 bg-portal-accent text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-1 shadow-sm">
            <Sparkles size={10} className="animate-pulse" />
            <span>Custom Brief</span>
          </div>
        )}
        {art.is_breaking && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-1 shadow-sm shadow-red-900/50 z-20">
            <Flame size={10} className="animate-pulse" />
            <span>BREAKING</span>
          </div>
        )}
      </div>

      <div className={`flex-1 flex flex-col ${isHero ? 'justify-center' : ''} space-y-3`}>
        {!minimal && (
          <header className="flex items-center justify-between text-[11px] font-mono uppercase">
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-portal-accent">{art.category}</span>
              <span className="text-portal-text-muted">•</span>
              <span className="text-portal-text-muted line-clamp-1">{art.source}</span>
            </div>
            <time dateTime={art.date} className="text-[10px] text-portal-text-muted shrink-0 ml-2 text-right">{art.timeAgo || art.date}</time>
          </header>
        )}

        <h4 className={`text-portal-text-main group-hover:text-portal-brand transition-colors font-serif font-bold leading-snug ${isHero ? 'text-2xl' : isCompact ? 'text-base' : 'text-xl'} ${minimal ? 'text-left line-clamp-3 text-base sm:text-lg' : ''}`}>
          {art.title}
        </h4>

        {!isCompact && !minimal && (
          <p className="text-sm line-clamp-3 leading-relaxed text-portal-text-muted">
            {art.summary}
          </p>
        )}

        {!minimal && (
          <footer className="pt-2 flex items-center justify-between text-[10px] font-mono mt-auto">
            <div className="flex items-center space-x-3 text-portal-text-muted flex-wrap gap-y-1">
              <span className="flex items-center space-x-1">
                <Clock size={12} />
                <span>{art.readTime || '4 min read'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{art.views?.toLocaleString() || 400} views</span>
              </span>
              {art.importance_score !== undefined && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center space-x-1 text-portal-accent font-bold" title="Importance Score">
                    <Activity size={12} />
                    <span>{art.importance_score.toFixed(1)}</span>
                  </span>
                </>
              )}
              {art.source_count !== undefined && art.source_count > 1 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center space-x-1 text-portal-brand" title="Unique Sources">
                    <Newspaper size={12} />
                    <span>{art.source_count} sources</span>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => toggleBookmark(art.id, e)}
                className="p-1 hover:text-portal-text-main hover:bg-portal-bg text-portal-text-muted transition-colors rounded-full"
                title="Bookmark article"
                aria-label={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
              >
                <BookMarked size={13} className={isBookmarked ? "text-yellow-500 fill-yellow-500" : ""} />
              </motion.button>
              <span className="group-hover:translate-x-1 transition-transform inline-flex items-center font-bold text-portal-brand">
                Review {isCustomFeed ? 'custom briefing' : 'analysis'} <ChevronRight size={12} />
              </span>
            </div>
          </footer>
        )}
      </div>
    </motion.article>
  );
});
