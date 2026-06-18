import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import { Flame } from 'lucide-react';

interface PoliticsPageProps {
  theme: 'dark' | 'light' | 'sepia';
  articles: NewsArticle[];
  handleOpenArticle: (art: NewsArticle) => void;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  bookmarks: string[];
  failedImages: string[];
  setFailedImages: (f: any) => void;
}

export default function PoliticsPage({ articles, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages }: PoliticsPageProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b pb-2 border-portal-border">
        <div className="flex items-center space-x-3">
          <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
            Politics & Global Policy
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
            {articles.length} indexes
          </span>
        </div>
        <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
          <Flame size={12} className="text-[#ef4444] animate-pulse" />
          <span className="hidden sm:inline">Live Political Radar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
        {articles.length === 0 ? (
          <div className="p-8 border border-dashed text-center text-xs rounded-xl font-mono border-portal-border text-portal-text-muted col-span-full">
            No politics intelligence available.
          </div>
        ) : (
          articles.map((art, idx) => (
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
    </div>
  );
}
