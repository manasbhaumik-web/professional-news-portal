import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Landmark, Briefcase, Activity, Rocket } from 'lucide-react';
import { BrandLogoPlaceholder } from './BrandLogoPlaceholder';

interface CategorizedHighlightsSectionProps {
    articles: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
}

const CATEGORIES = [
    { id: 'Politics', icon: Landmark, color: 'text-blue-500', keywords: ['politics', 'policy', 'government'] },
    { id: 'Business', icon: Briefcase, color: 'text-green-500', keywords: ['business', 'finance', 'markets', 'economy'] },
    { id: 'Sports', icon: Activity, color: 'text-orange-500', keywords: ['sports', 'football', 'cricket', 'athletics'] },
    { id: 'Technology', icon: Rocket, color: 'text-purple-500', keywords: ['tech', 'technology', 'science', 'cyber'] },
];

export default function CategorizedHighlightsSection({ articles, handleOpenArticle }: CategorizedHighlightsSectionProps) {
    const [failedImages, setFailedImages] = useState<string[]>([]);
    
    if (!articles || articles.length === 0) return null;

    // Find the top article for each category
    const categoryArticles = CATEGORIES.map(cat => {
        let art = articles.find(a => 
            cat.keywords.some(kw => 
                a.category.toLowerCase().includes(kw) || 
                (a.title && a.title.toLowerCase().includes(kw))
            )
        );
        // Fallback if no exact match is found for the category (to preserve layout)
        if (!art) {
            art = articles[Math.floor(Math.random() * articles.length)];
        }
        return { category: cat, article: art };
    });

    return (
        <section className="w-full mb-6 relative">
            <div className="flex items-center gap-2 mb-4 px-2 border-l-4 border-portal-brand">
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-portal-text-main">
                    Categorized News Feeds
                </h2>
                <span className="text-[10px] text-portal-text-muted font-mono uppercase bg-portal-surface px-1.5 py-0.5 border border-portal-border">Live Highlights</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {categoryArticles.map(({ category, article }, idx) => {
                    const Icon = category.icon;
                    if (!article) return null;

                    return (
                        <div 
                            key={`${category.id}-${idx}`}
                            onClick={() => handleOpenArticle(article)}
                            className="group cursor-pointer flex flex-col bg-portal-surface border border-portal-border shadow-sm hover:shadow-md transition-all duration-300 hover:border-portal-brand overflow-hidden h-[180px] relative"
                        >
                            <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-sm text-[9px] font-black tracking-widest uppercase text-white shadow-sm border border-white/10">
                                <Icon size={10} className={category.color} />
                                {category.id}
                            </div>
                            
                            <div className="h-28 w-full overflow-hidden relative bg-portal-bg shrink-0 flex items-center justify-center">
                                {article.imageUrl && !failedImages.includes(article.id) ? (
                                    <img 
                                        src={article.imageUrl} 
                                        alt={article.title}
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { 
                                            (e.target as HTMLImageElement).style.opacity = '0.3';
                                            if (setFailedImages) setFailedImages((prev: string[]) => [...prev, article.id]);
                                        }}
                                    />
                                ) : (
                                    <BrandLogoPlaceholder article={article} iconSizeClass="w-12 h-12" textSizeClass="text-3xl" textMarginClass="mt-1" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                            </div>
                            
                            <div className="p-3 flex-1 flex flex-col justify-between z-10 bg-portal-surface">
                                <h3 className="text-xs font-bold font-serif text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-2 leading-tight">
                                    {article.title}
                                </h3>
                                <div className="text-[9px] font-mono text-portal-text-muted flex justify-between mt-1">
                                    <span className="truncate max-w-[60%]">{article.source}</span>
                                    <span className="shrink-0">{article.timeAgo || article.date}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
