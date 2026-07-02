import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import GoogleNewsSection from '../components/GoogleNewsSection';
import EmptyFeedState from '../components/EmptyFeedState';
import { Cpu } from 'lucide-react';

interface ScienceTechPageProps {
    theme: 'dark' | 'light' | 'sepia';
    articles: NewsArticle[];
    selectedCategoryFromMenu: string;
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages?: string[];
    setFailedImages?: (f: any) => void;
    clearFilters?: () => void;
    fallbackArticles?: NewsArticle[];
}

export default function ScienceTechPage({ articles, selectedCategoryFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages, clearFilters, fallbackArticles }: ScienceTechPageProps) {
    const combinedArticles = selectedCategoryFromMenu === 'All'
        ? articles
        : articles.filter(art =>
            art.title.toLowerCase().includes(selectedCategoryFromMenu.toLowerCase()) ||
            art.summary?.toLowerCase().includes(selectedCategoryFromMenu.toLowerCase())
        );

    const allSorted = combinedArticles.sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.date || Date.now()).getTime();
        const timeB = new Date(b.publishedAt || b.date || Date.now()).getTime();
        return timeB - timeA;
    }).filter((art, idx, self) => idx === self.findIndex(a => a.title.toLowerCase().trim() === art.title.toLowerCase().trim()));

    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
    const nonGoogle = allSorted.filter(art => !isGoogle(art));
    const googleArticles = allSorted.filter(art => isGoogle(art));

    const displayArticles = nonGoogle.slice(0, 10);
    const overflowArticles = nonGoogle.slice(43);
    const displayGoogleArticles = googleArticles.slice(0, 40);


    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                <div className="flex items-center space-x-3">
                    <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                        {selectedCategoryFromMenu === 'All' ? 'Science & Technology' : `${selectedCategoryFromMenu} Feed`}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
                        {`${allSorted.length} updates`}
                    </span>
                </div>
                <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                    <Cpu size={12} className="text-cyan-500" />
                    <span className="hidden sm:inline">{selectedCategoryFromMenu === 'All' ? 'Live Tech Radar' : `Live ${selectedCategoryFromMenu} Radar`}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                {displayArticles.length === 0 ? (
                    <EmptyFeedState
                        onClearFilters={clearFilters || (() => { })}
                        fallbackArticles={fallbackArticles || []}
                        handleOpenArticle={handleOpenArticle}
                    />
                ) : (
                    displayArticles.map((art, idx) => (
                        <ArticleCard
                            key={art.id}
                            index={idx}
                            art={art}
                            handleOpenArticle={handleOpenArticle}
                            toggleBookmark={toggleBookmark}
                            isBookmarked={bookmarks.includes(art.id)}
                            failedImages={failedImages}
                            setFailedImages={setFailedImages}
                        />
                    ))
                )}
            </div>

            {overflowArticles.length > 0 && (
                <MoreFromWire
                    articles={overflowArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages || []}
                    setFailedImages={setFailedImages || (() => { })}
                />
            )}

            {nonGoogle.length === 0 && displayGoogleArticles.length > 0 && (
                <GoogleNewsSection
                    articles={displayGoogleArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages || []}
                    setFailedImages={setFailedImages || (() => { })}
                />
            )}
        </div>
    );
}


