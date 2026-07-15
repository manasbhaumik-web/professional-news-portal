import React, { useState, useEffect } from 'react';
import { Minus, Plus, ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatLocalTime } from '../utils/formatLocalTime';


interface MainAdBannerProps {
    isAdMinimized: boolean;
    setIsAdMinimized: (val: boolean) => void;
    topHeadlines: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
}

export default React.memo(function MainAdBanner({
    isAdMinimized,
    setIsAdMinimized,
    topHeadlines,
    handleOpenArticle
}: MainAdBannerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

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

    const article = topHeadlines[activeIndex] || topHeadlines[0];

    return (
        <>
            {isAdMinimized ? (
                /* ── Minimized strip ── */
                <div className="mb-2 bg-portal-surface border-y border-portal-border/60 py-1.5 px-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 text-[8px] font-mono tracking-widest text-portal-brand uppercase border border-portal-brand/50 px-1.5 py-0.5 flex items-center gap-1">
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
                /* ── #1 Cinematic Full-Bleed Hero ── */
                <section id="top-headlines-carousel" className="mb-4 text-white border-0">
                    <div className="flex gap-4 items-stretch">
                        {/* Cinematic hero card */}
                        <div
                            className={`flex-1 flex flex-col sm:flex-row relative group overflow-hidden shadow-xl bg-portal-surface border border-portal-border/60 cursor-pointer transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            onClick={() => handleOpenArticle(article)}
                            style={{ minHeight: '220px' }}
                        >
                            {/* Left Side: High Res Image */}
                            <div className="w-full sm:w-1/2 relative overflow-hidden shrink-0 bg-black min-h-[140px] sm:min-h-[220px]">
                                {article.imageUrl && (
                                    <img
                                        key={article.id}
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover animate-kenburns opacity-90"
                                    />
                                )}
                                {/* Cinematic gradient scrim over image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10 z-10 pointer-events-none" />
                            </div>

                            {/* Right Side: Content */}
                            <div className="w-full sm:w-1/2 relative z-20 flex flex-col justify-between px-5 sm:px-8 py-5 sm:py-6">
                                {/* Minimize button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsAdMinimized(true); }}
                                    className="absolute top-3 right-3 z-30 p-1.5 bg-portal-surface-hover/80 text-portal-text-muted hover:text-portal-text-main transition-colors backdrop-blur-sm border border-portal-border/50 rounded-md"
                                    title="Minimize"
                                >
                                    <Minus size={14} />
                                </button>

                                {/* Category chip */}
                                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border border-portal-brand/30 text-portal-brand bg-portal-brand/5">
                                        {article.category}
                                    </span>
                                    <span className="text-[9px] font-mono text-portal-text-muted">{article.readTime}</span>
                                </div>

                                {/* Headline */}
                                <div className="flex flex-col gap-3 mt-auto">
                                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-portal-text-main leading-tight line-clamp-3 pr-4 mt-2 sm:mt-0">
                                        {article.title}
                                    </h2>

                                    {/* Rule separator */}
                                    <div className="w-12 h-px bg-portal-brand" />

                                    {/* Summary */}
                                    {article.summary && (
                                        <p className="text-[12px] text-portal-text-muted leading-relaxed hidden sm:line-clamp-2">
                                            {article.summary}
                                        </p>
                                    )}

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[11px] font-bold text-portal-text-main font-mono">{article.source}</span>
                                            <span className="text-[10px] text-portal-text-muted font-mono">{formatLocalTime(article.date, article.publishedAt)}</span>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-1 text-portal-brand text-[10px] font-bold font-mono uppercase tracking-wide">
                                            Read Full Story <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Progress dots */}
                                <div className="absolute bottom-3 right-5 sm:right-8 flex items-center gap-1.5 z-30">
                                    {topHeadlines.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                                            className={`transition-all duration-300 rounded-full ${idx === activeIndex
                                                ? 'w-6 h-1.5 bg-portal-brand'
                                                : 'w-1.5 h-1.5 bg-portal-border hover:bg-portal-text-muted'
                                                }`}
                                            aria-label={`Headline ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Left arrow (global over image) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm rounded-md"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Right arrow (global over content) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-portal-surface-hover/90 text-portal-text-main hover:bg-portal-border transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-portal-border/50 rounded-md"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Advertisement panel */}
                        <div
                            className="w-44 shrink-0 hidden lg:flex flex-col overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 border border-slate-700/50 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
                                <div className="text-white text-base font-black tracking-tight relative z-10">Horizon+</div>
                                <div className="text-white/80 text-[8px] font-mono uppercase tracking-widest relative z-10">Premium Access</div>
                            </div>
                            <div className="flex flex-col gap-1.5 px-2.5 py-2 flex-1">
                                <div className="text-[7px] font-mono uppercase tracking-widest text-slate-400 self-end">Sponsored</div>
                                <p className="text-[10px] font-black text-white leading-snug">Go Ad-Free + Unlock Archives</p>
                                <ul className="text-[9px] text-slate-300 space-y-0.5">
                                    <li>✓ Zero advertisements</li>
                                    <li>✓ 10-year archive access</li>
                                    <li>✓ Faster data streams</li>
                                </ul>
                                <button className="mt-auto text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-1 hover:opacity-90 transition-opacity w-full">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
});
