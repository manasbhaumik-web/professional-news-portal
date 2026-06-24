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
 const isFootballOrCricket = art.category === 'Sports' || art.sportName === 'Football' || art.sportName === 'Cricket' || (art.title && (art.title.toLowerCase().includes('football') || art.title.toLowerCase().includes('cricket') || art.title.toLowerCase().includes('fifa')));
 const isCountryOrLocal = art.category === 'Country' || art.category === 'Local';

 if (hasMissingImage && !isFootballOrCricket && !isCountryOrLocal) return null;

 const defaultSportsImg = art.title?.toLowerCase().includes('cricket') || art.sportName === 'Cricket'
 ? 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' 
 : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80';
 
 const defaultLocalImg = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80';

 const displayImage = hasMissingImage 
   ? (isCountryOrLocal ? defaultLocalImg : defaultSportsImg) 
   : art.imageUrl;

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
 className={`transition-all duration-300 group cursor-pointer flex gap-5 p-5 bg-portal-surface border border-portal-border hover:bg-portal-surface-hover shadow-sm hover:shadow-md transform h-full ${bentoClass}`}
 >
 {displayImage && (
 <div className={`overflow-hidden shrink-0 relative bg-portal-bg ${imageClass}`}>
 <img
 src={displayImage}
 alt={art.title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 onError={(e) => {
 if (displayImage !== defaultSportsImg) {
 setImgError(true);
 if (setFailedImages) setFailedImages((prev: string[]) => [...prev, art.id]);
 } else {
 (e.target as HTMLImageElement).style.display = 'none';
 }
 }}
 />
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
 </div>
 )}

 <div className={`flex-1 flex flex-col ${isHero ? 'justify-center' : ''} space-y-3`}>
 {!minimal && (
 <header className="flex items-center justify-between text-[11px] font-mono uppercase">
 <div className="flex items-center space-x-2">
 <span className="font-bold tracking-wider text-portal-accent">{art.category}</span>
 <span className="text-portal-text-muted">•</span>
 <span className="text-portal-text-muted line-clamp-1">{art.source}</span>
 </div>
 <span className="text-[10px] text-portal-text-muted shrink-0 ml-2 text-right">{art.timeAgo || art.date}</span>
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
 className="p-1 hover:text-portal-text-main hover:bg-portal-bg text-portal-text-muted transition-colors"
 title="Bookmark article"
 >
 <BookMarked size={13} className={isBookmarked ? "text-yellow-500 fill-yellow-500" : ""} />
 </button>
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
