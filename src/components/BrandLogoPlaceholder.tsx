import React, { useState } from 'react';
import { NewsArticle } from '../types';

export function BrandLogoPlaceholder({ article, className = "", iconSizeClass = "w-16 h-16", textSizeClass = "text-4xl", textMarginClass = "mt-2" }: { article: NewsArticle, className?: string, iconSizeClass?: string, textSizeClass?: string, textMarginClass?: string }) {
  const [imgError, setImgError] = useState(false);
  
  const getDomain = (url?: string) => {
    if (!url) return null;
    try {
      return new URL(url).hostname;
    } catch (e) {
      return null;
    }
  };
  const targetUrl = article.originalUrl || article.url;
  const domain = getDomain(targetUrl);
  const brandLogoUrl = domain && !imgError ? `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=128` : null;

  return (
    <div className={`w-full h-full bg-portal-surface border border-portal-border/30 flex flex-col items-center justify-center p-4 ${className}`}>
      {brandLogoUrl ? (
        <img src={brandLogoUrl} alt={article.source} className={`${iconSizeClass} object-contain opacity-70 group-hover:scale-110 transition-transform duration-500`} referrerPolicy="no-referrer" onError={() => setImgError(true)} />
      ) : (
        <div className={`${textSizeClass} font-black font-serif text-portal-text-muted/30 group-hover:text-portal-brand transition-colors uppercase`}>
          {article.source ? article.source.charAt(0) : '?'}
        </div>
      )}
      <div className={`${textMarginClass} text-[10px] font-mono text-portal-text-muted/60 text-center tracking-widest uppercase line-clamp-1`}>
        {article.source}
      </div>
    </div>
  );
}
