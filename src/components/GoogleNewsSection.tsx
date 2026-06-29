import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';
import ArticleCard from './ArticleCard';

interface GoogleNewsSectionProps {
    articles: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages: string[];
    setFailedImages: (f: any) => void;
}

export default function GoogleNewsSection({
    articles,
    handleOpenArticle,
    toggleBookmark,
    bookmarks,
    failedImages,
    setFailedImages
}: GoogleNewsSectionProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 mb-4 w-full relative group"
        >
            <div className="flex items-center justify-between border-b border-portal-border pb-3 mb-5">
                <h3 className="text-portal-text-main font-serif font-black text-xl flex items-center gap-2">
                    <Search size={18} className="text-blue-500" /> Google News Feeds
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main p-2 transition-colors disabled:opacity-30"
                        onClick={(e) => { e.currentTarget.parentElement?.parentElement?.nextElementSibling?.scrollBy({ left: -350, behavior: 'smooth' }) }}
                    >
                        <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <button
                        className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main p-2 transition-colors disabled:opacity-30"
                        onClick={(e) => { e.currentTarget.parentElement?.parentElement?.nextElementSibling?.scrollBy({ left: 350, behavior: 'smooth' }) }}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hidden-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
