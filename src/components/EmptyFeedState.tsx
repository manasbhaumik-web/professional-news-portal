import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Newspaper, Wifi, Search } from 'lucide-react';
import { NewsArticle } from '../types';

interface EmptyFeedStateProps {
    onClearFilters: () => void;
    fallbackArticles: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
}

// Animated SVG illustration — orbital signal with newspaper at center
const EmptyIllustration = () => (
    <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
    >
        {/* Outer orbit ring */}
        <motion.circle
            cx="90"
            cy="90"
            r="72"
            stroke="var(--color-portal-brand)"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.25"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '90px 90px' }}
        />
        {/* Middle orbit ring */}
        <motion.circle
            cx="90"
            cy="90"
            r="52"
            stroke="var(--color-portal-accent)"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.2"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '90px 90px' }}
        />

        {/* Orbiting dot on outer ring */}
        <motion.circle
            cx="162"
            cy="90"
            r="5"
            fill="var(--color-portal-brand)"
            opacity="0.7"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '90px 90px' }}
        />
        {/* Orbiting dot on inner ring */}
        <motion.circle
            cx="90"
            cy="38"
            r="4"
            fill="var(--color-portal-accent)"
            opacity="0.6"
            animate={{ rotate: -360 }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '90px 90px' }}
        />

        {/* Center background circle */}
        <circle cx="90" cy="90" r="34" fill="var(--color-portal-surface)" stroke="var(--color-portal-border)" strokeWidth="1.5" />

        {/* Newspaper icon paths */}
        {/* Page body */}
        <rect x="76" y="77" width="28" height="26" rx="2" fill="none" stroke="var(--color-portal-text-muted)" strokeWidth="1.5" opacity="0.5" />
        {/* Headline line */}
        <line x1="80" y1="83" x2="100" y2="83" stroke="var(--color-portal-text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {/* Body lines */}
        <line x1="80" y1="88" x2="100" y2="88" stroke="var(--color-portal-text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        <line x1="80" y1="92" x2="96" y2="92" stroke="var(--color-portal-text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        <line x1="80" y1="96" x2="98" y2="96" stroke="var(--color-portal-text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />

        {/* Signal arcs (wifi-like) */}
        <motion.path
            d="M 78 72 Q 90 62 102 72"
            stroke="var(--color-portal-brand)"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
            d="M 72 66 Q 90 52 108 66"
            stroke="var(--color-portal-brand)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.path
            d="M 66 61 Q 90 43 114 61"
            stroke="var(--color-portal-brand)"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.2"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />

        {/* Antenna dot */}
        <circle cx="90" cy="68" r="2.5" fill="var(--color-portal-brand)" opacity="0.8" />
    </svg>
);

// Three animated loading dots
const PulseDots = () => (
    <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map(i => (
            <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-portal-brand"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
        ))}
    </div>
);

export default function EmptyFeedState({ onClearFilters, fallbackArticles, handleOpenArticle }: EmptyFeedStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 col-span-full w-full" role="status" aria-live="polite" aria-label="No articles found">
            <motion.div
                className="flex flex-col items-center text-center max-w-md mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Illustration */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="mb-6"
                >
                    <EmptyIllustration />
                </motion.div>

                {/* Headline */}
                <motion.h3
                    className="text-2xl font-serif font-bold text-portal-text-main mb-3 leading-snug"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                >
                    No Stories Found
                </motion.h3>

                {/* Subtext */}
                <motion.p
                    className="text-sm text-portal-text-muted leading-relaxed mb-1 max-w-[280px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                >
                    Our wires are scanning the globe — this feed may be empty or your filters returned no matches.
                </motion.p>

                {/* Animated dots */}
                <motion.div
                    className="my-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                >
                    <PulseDots />
                </motion.div>

                {/* CTA Button */}
                <motion.button
                    onClick={onClearFilters}
                    className="mt-2 inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-portal-brand hover:bg-portal-brand-hover text-white text-sm font-semibold shadow-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-portal-bg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                    aria-label="Clear all filters and return to top stories"
                >
                    <RefreshCw size={15} className="shrink-0" />
                    Clear All Filters
                </motion.button>

                {/* Hint row */}
                <motion.p
                    className="mt-4 text-[11px] font-mono text-portal-text-muted opacity-60 flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    aria-hidden="true"
                >
                    <Search size={11} />
                    Try a different category or remove keyword filters
                </motion.p>
            </motion.div>

            {/* Fallback Articles */}
            {fallbackArticles.length > 0 && (
                <motion.div
                    className="w-full max-w-4xl border-t border-portal-border pt-8 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-portal-text-muted mb-6 text-center flex items-center justify-center gap-2">
                        <Newspaper size={12} aria-hidden="true" />
                        Meanwhile, catch up on Global Top Stories
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
                        {fallbackArticles.slice(0, 3).map((art, i) => (
                            <motion.div
                                key={art.id}
                                onClick={() => handleOpenArticle(art)}
                                className="group cursor-pointer flex flex-col gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand focus-visible:ring-offset-2 focus-visible:ring-offset-portal-bg"
                                tabIndex={0}
                                role="button"
                                aria-label={`Read: ${art.title}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleOpenArticle(art);
                                    }
                                }}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                                whileHover={{ y: -3 }}
                            >
                                <div className="aspect-[16/9] w-full overflow-hidden bg-portal-surface border border-portal-border relative shadow-sm group-hover:shadow-md transition-shadow">
                                    {art.imageUrl ? (
                                        <img

                                            src={art.imageUrl}
                                            alt={art.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-portal-text-muted text-xs font-mono">
                                            <Newspaper size={28} className="opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono font-bold tracking-widest text-portal-brand uppercase mb-1 block">
                                        {art.category || 'Global'}
                                    </span>
                                    <h5 className="text-[13px] font-bold text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-3 leading-snug">
                                        {art.title}
                                    </h5>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
