import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface MainAdBannerProps {
  isAdMinimized: boolean;
  setIsAdMinimized: (val: boolean) => void;
  trendingArticles: NewsArticle[];
  handleOpenArticle: (art: NewsArticle) => void;
}

export default React.memo(function MainAdBanner({
  isAdMinimized,
  setIsAdMinimized,
  trendingArticles,
  handleOpenArticle
}: MainAdBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const seenTitles = new Set<string>();
  const topHeadlines = [...trendingArticles]
    .filter(art => {
      if (!art.imageUrl || failedImages.includes(art.id)) return false;
      const normTitle = art.title.trim().toLowerCase();
      if (seenTitles.has(normTitle)) return false;
      seenTitles.add(normTitle);
      return true;
    })
    .sort((a, b) => {
      const tb = new Date(b.publishedAt || b.date).getTime();
      const ta = new Date(a.publishedAt || a.date).getTime();
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    })
    .slice(0, 3);

  const goToSlide = (idx: number) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }, 200);
  };

  const nextSlide = () => goToSlide((activeIndex + 1) % topHeadlines.length);
  const prevSlide = () => goToSlide((activeIndex - 1 + topHeadlines.length) % topHeadlines.length);

  useEffect(() => {
    if (topHeadlines.length === 0 || isAdMinimized) return;
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, [topHeadlines.length, isAdMinimized, activeIndex]);

  if (topHeadlines.length === 0) return null;

  const article = topHeadlines[activeIndex];

  return (
    <>
      {isAdMinimized ? (
        /* ── Minimized strip ── */
        <div className="mb-2 bg-portal-surface border-y border-portal-border/60 py-1.5 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 text-[8px] font-mono tracking-widest text-portal-brand uppercase border border-portal-brand/50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <TrendingUp size={10} /> Headlines
            </span>
            <span className="text-[10px] font-semibold text-portal-text-main truncate">{article.title}</span>
          </div>
          <button onClick={() => setIsAdMinimized(false)} className="shrink-0 ml-3 flex items-center gap-1 text-portal-brand hover:opacity-70 transition-opacity cursor-pointer">
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Expand</span>
            <Plus size={11} />
          </button>
        </div>
      ) : (
        /* ── Expanded Split Card ── */
        <section id="top-headlines-carousel" className="mb-4 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 text-white border-0">

          {/* ── Top label bar ── */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950/40 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-portal-brand" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-portal-brand">Top Headlines</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={prevSlide} className="p-1 rounded border border-slate-600 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-400 transition-all cursor-pointer">
                <ChevronLeft size={13} />
              </button>
              <button onClick={nextSlide} className="p-1 rounded border border-slate-600 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-400 transition-all cursor-pointer">
                <ChevronRight size={13} />
              </button>
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <button onClick={(e) => { e.stopPropagation(); setIsAdMinimized(true); }} className="p-1 rounded border border-slate-600 bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer" title="Minimize">
                <Minus size={13} />
              </button>
            </div>
          </div>

          {/* ── Split body ── */}
          <div
            className={`flex cursor-pointer transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => handleOpenArticle(article)}
          >
            {/* LEFT — Image flush with container */}
            <div className="w-24 sm:w-56 md:w-72 relative overflow-hidden shrink-0">
              <img
                key={article.id}
                src={article.imageUrl}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => {
                  setFailedImages(prev => [...prev, article.id]);
                }}
              />
            </div>

            {/* RIGHT — Two columns: Content + Advertisement */}
            <div className="flex flex-1 min-w-0 overflow-hidden">

              {/* Content column */}
              <div className="flex flex-col justify-between px-5 py-4 flex-1 min-w-0 bg-transparent lg:border-r lg:border-slate-700/50">
                {/* Index pill */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-slate-600" />
                  <span className="text-[9px] font-mono text-slate-400">{article.readTime}</span>
                </div>

                {/* Headline */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white leading-tight line-clamp-2 hover:text-portal-brand transition-colors drop-shadow-sm">
                  {article.title}
                </h2>

                {/* Summary */}
                {article.summary && (
                  <p 
                    className="text-[11px] text-slate-300 leading-relaxed mt-2 hidden md:block overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
                  >
                    {article.summary}
                  </p>
                )}

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-white font-mono">{article.source}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-portal-brand text-[10px] font-bold font-mono uppercase tracking-wide group">
                    Read <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Advertisement column */}
              <div
                className="w-44 shrink-0 mr-2 border-l border-slate-700/50 hidden lg:flex flex-col overflow-hidden cursor-default bg-slate-900/40"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Ad header strip */}
                <div className="w-full h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)'}} />
                  <div className="text-white text-base font-black tracking-tight relative z-10">Horizon+</div>
                  <div className="text-white/80 text-[8px] font-mono uppercase tracking-widest relative z-10">Premium Access</div>
                </div>

                {/* Ad body */}
                <div className="flex flex-col gap-1.5 px-2.5 py-2 flex-1">
                  <div className="text-[7px] font-mono uppercase tracking-widest text-slate-400 self-end">Sponsored</div>
                  <p className="text-[10px] font-black text-white leading-snug">Go Ad-Free + Unlock Archives</p>
                  <ul className="text-[9px] text-slate-300 space-y-0.5">
                    <li>✓ Zero advertisements</li>
                    <li>✓ 10-year archive access</li>
                    <li>✓ Faster data streams</li>
                  </ul>
                  <button className="mt-auto text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-1 rounded-md hover:opacity-90 transition-opacity w-full">
                    Upgrade Now
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ── Progress dots ── */}
          <div className="flex items-center justify-center gap-1.5 py-2 border-t border-slate-700/50 bg-slate-950/40">
            {topHeadlines.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-5 h-1 bg-portal-brand' : 'w-1.5 h-1 bg-slate-600 hover:bg-slate-400'}`}
                aria-label={`Headline ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
});
