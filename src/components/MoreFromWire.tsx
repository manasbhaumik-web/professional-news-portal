import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';
import ArticleCard from './ArticleCard';

interface MoreFromWireProps {
    articles: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages: string[];
    setFailedImages: (f: any) => void;
}

export default function MoreFromWire({
    articles,
    handleOpenArticle,
    toggleBookmark,
    bookmarks,
    failedImages,
    setFailedImages
}: MoreFromWireProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!articles || articles.length === 0) return;
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: 350, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [articles]);

    if (!articles || articles.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-4 w-full relative group"
        >
            <div className="flex items-center justify-between border-b border-portal-border pb-3 px-1">
                <h3 className="font-serif font-black text-lg tracking-tight capitalize text-portal-text-main flex items-center gap-2">
                    <Globe size={18} className="text-portal-brand" /> Global Wire Feed
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main p-2 transition-colors disabled:opacity-30"
                        onClick={() => { scrollContainerRef.current?.scrollBy({ left: -350, behavior: 'smooth' }) }}
                    >
                        <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button
                        className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main p-2 transition-colors disabled:opacity-30"
                        onClick={() => { scrollContainerRef.current?.scrollBy({ left: 350, behavior: 'smooth' }) }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hidden-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {articles.map((art) => (
                    <div key={art.id} className="h-full min-w-[280px] w-[280px] sm:min-w-[340px] sm:w-[340px] snap-center shrink-0">
                        <ArticleCard
                            art={art}
                            handleOpenArticle={handleOpenArticle}
                            toggleBookmark={toggleBookmark}
                            isBookmarked={bookmarks.includes(art.id)}
                            failedImages={failedImages}
                            setFailedImages={setFailedImages}
                            minimal={true}
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
