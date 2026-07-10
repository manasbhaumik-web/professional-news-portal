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
                            className={`flex-1 relative group overflow-hidden shadow-2xl min-h-[200px] sm:min-h-[260px] cursor-pointer transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            onClick={() => handleOpenArticle(article)}
                            style={{ minHeight: '220px' }}
                        >
                            {/* Ken Burns background image */}
                            {article.imageUrl && (
                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        key={article.id}
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover animate-kenburns"

                                    />
                                </div>
                            )}

                            {/* Cinematic gradient scrim over image */}
                            <div className="hero-scrim absolute inset-0 z-10" />

                            {/* Minimize button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsAdMinimized(true); }}
                                className="absolute top-3 right-3 z-30 p-1.5 bg-black/50 text-white hover:bg-black/75 transition-colors backdrop-blur-sm"
                                title="Minimize"
                            >
                                <Minus size={14} />
                            </button>

                            {/* Left arrow */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Right arrow */}
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/40 text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <ChevronRight size={20} />
                            </button>

                            {/* Content overlaid on left side */}
                            <div className="relative z-20 h-full flex flex-col justify-between px-5 sm:px-8 py-5 sm:py-6 max-w-xl">
                                {/* Category chip */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border border-cyan-500/60 text-cyan-400 backdrop-blur-sm bg-black/30">
                                        {article.category}
                                    </span>
                                    <span className="text-[9px] font-mono text-white/50">{article.readTime}</span>
                                </div>

                                {/* Headline with soft text glow */}
                                <div className="flex flex-col gap-3 mt-auto">
                                    <h2
                                        className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white leading-tight line-clamp-3 pr-4"
                                        style={{ textShadow: '0 0 40px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.8)' }}
                                    >
                                        {article.title}
                                    </h2>

                                    {/* Glowing cyan rule separator */}
                                    <div className="w-12 h-px bg-cyan-400" style={{ boxShadow: '0 0 8px rgba(6,182,212,0.8)' }} />

                                    {/* Summary */}
                                    {article.summary && (
                                        <p className="text-[12px] text-white/70 leading-relaxed hidden sm:line-clamp-2">
                                            {article.summary}
                                        </p>
                                    )}

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[11px] font-bold text-white font-mono">{article.source}</span>
                                            <span className="text-[10px] text-white/50 font-mono">{formatLocalTime(article.date, article.publishedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-cyan-400 text-[10px] font-bold font-mono uppercase tracking-wide">
                                            Read Full Story <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress dots — glowing bar style */}
                            <div className="absolute bottom-3 left-5 sm:left-8 flex items-center gap-1.5 z-30">
                                {topHeadlines.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                                        className={`transition-all duration-300 rounded-full ${idx === activeIndex
                                            ? 'w-6 h-1.5 bg-cyan-400'
                                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                                            }`}
                                        style={idx === activeIndex ? { boxShadow: '0 0 8px rgba(6,182,212,0.9)' } : {}}
                                        aria-label={`Headline ${idx + 1}`}
                                    />
                                ))}
                            </div>
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
