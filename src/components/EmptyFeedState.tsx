import React from 'react';
import { AlertCircle } from 'lucide-react';
import { NewsArticle } from '../types';

interface EmptyFeedStateProps {
    onClearFilters: () => void;
    fallbackArticles: NewsArticle[];
    handleOpenArticle: (art: NewsArticle) => void;
}

export default function EmptyFeedState({ onClearFilters, fallbackArticles, handleOpenArticle }: EmptyFeedStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 col-span-full w-full">
            <div className="flex flex-col items-center text-center max-w-md mx-auto mb-12">
                <div className="w-16 h-16 bg-portal-surface border border-portal-border rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <AlertCircle size={32} className="text-portal-text-muted opacity-50" />
                </div>
                <h3 className="text-xl font-serif font-bold text-portal-text-main mb-2">Sorry !! Nothing to display in this section at the moment</h3>
                <button 
                    onClick={onClearFilters}
                    className="px-6 py-2.5 bg-portal-brand hover:bg-portal-brand-hover text-white text-sm font-semibold rounded shadow-lg transition-colors cursor-pointer mt-4"
                >
                    Clear All Filters
                </button>
            </div>

            {fallbackArticles.length > 0 && (
                <div className="w-full max-w-4xl border-t border-portal-border pt-8 mt-4">
                    <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-portal-text-muted mb-6 text-center">
                        Meanwhile, catch up on Global Top Stories
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
                        {fallbackArticles.slice(0, 3).map(art => (
                            <div 
                                key={art.id} 
                                onClick={() => handleOpenArticle(art)}
                                className="group cursor-pointer flex flex-col gap-3"
                            >
                                <div className="aspect-[16/9] w-full rounded overflow-hidden bg-portal-surface border border-portal-border relative">
                                    {art.imageUrl ? (
                                        <img referrerPolicy="no-referrer" src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-portal-text-muted text-xs font-mono">No Image</div>
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono font-bold tracking-widest text-portal-brand uppercase mb-1 block">{art.category || 'Global'}</span>
                                    <h5 className="text-[13px] font-bold text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-3 leading-snug">{art.title}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
