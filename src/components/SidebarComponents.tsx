import React, { useState, useEffect } from 'react';
import { BookMarked, PlayCircle } from 'lucide-react';
import { NewsArticle } from '../types';

export function SidebarAdvertisement() {
  return (
    <section id="sidebar-advertisement" className="border overflow-hidden bg-portal-surface border-portal-border shadow-sm hover:border-portal-brand/40 transition-all cursor-pointer group relative">
      <div className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg px-1.5 py-0.5 border border-portal-border/50 z-10">Sponsored</div>

      {/* Hero banner */}
      <div className="w-full h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="text-white text-2xl font-black tracking-tight mb-0.5">Horizon Intelligence</div>
        <div className="text-white/80 text-[10px] font-mono uppercase tracking-widest">Premium Suite 2026</div>
        <div className="absolute bottom-2 right-2 bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 ">NEW</div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="text-xs font-black text-portal-text-main group-hover:text-portal-brand transition-colors leading-snug">
          Exclusive News Intelligence Platform
        </h4>
        <p className="text-[10px] text-portal-text-muted mt-1 line-clamp-2 leading-relaxed">
          Summarize, fact-check and track stories across 50,000+ global sources. Used by 200k journalists.
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <div className="text-[9px] font-mono text-emerald-500 font-bold">★★★★★ 4.9/5</div>
          <button className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 hover:opacity-90 transition-opacity">
            Try Free
          </button>
        </div>
      </div>
    </section>
  );
}


export function OngoingIccSeriesCard({ cricketIsMock, cricketMatches }: { cricketIsMock: boolean, cricketMatches: any[] }) {
  return (
    <section id="ongoing-icc-series-card" className="border-2 flex flex-col overflow-hidden transition-all bg-portal-surface border-blue-500/40 shadow-lg shadow-blue-500/10 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <header className="p-4 border-b flex items-center justify-between border-blue-500/30 bg-blue-500/5 relative z-10">
        <h3 className="text-[13px] font-sans font-normal tracking-wider flex items-center text-portal-text-main">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          ONGOING ICC SERIES
        </h3>
        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 font-sans uppercase tracking-widest font-normal ring-1 ring-blue-500/30">Live</span>
      </header>
      <div className="p-4 space-y-4 relative z-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40">
        {cricketIsMock && (
          <div className="absolute top-0 right-0 m-2">
            <span className="flex items-center gap-1 text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
              <span className="w-1.5 h-1.5 bg-amber-500 "></span>Demo
            </span>
          </div>
        )}
        {cricketMatches.length === 0 ? (
          <div className="text-center py-6 text-[11px] font-sans text-portal-text-muted/60 border border-dashed border-blue-500/20 m-2">
            No live cricket matches right now.
          </div>
        ) : (
          cricketMatches.map((series, idx) => (
            <div key={idx} className="flex gap-3 cursor-pointer group p-2 -m-2 hover:bg-blue-500/5 transition-colors border border-transparent hover:border-blue-500/10">
              <div className="mt-1 shrink-0 w-1.5 h-1.5 bg-blue-500"></div>
              <div className="text-[13px] w-full pr-2">
                <p className="font-normal leading-snug text-portal-text-main group-hover:text-blue-500 transition-colors">{series.title}</p>
                {series.score && Array.isArray(series.score) && series.score.length > 0 && (
                  <div className="text-[12px] font-sans text-blue-400 mt-1 mb-0.5 font-normal tracking-tight space-y-0.5">
                    {series.score.map((s: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span>{s.team}</span>
                        <span>{s.score}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[11px] font-sans text-portal-text-muted mt-0.5">{series.matchType || series.matches} • <span className="text-portal-text-main/70">{series.status}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function BreakingNewsTicker({ relatedArticles, handleOpenArticle }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void }) {
  const breakingArticles = relatedArticles.filter(art => art.is_breaking).slice(0, 10);
  if (breakingArticles.length === 0) return null;

  return (
    <div id="breaking-news-ticker-fullwidth" className="w-full flex border-b border-red-500/20 bg-portal-surface overflow-hidden relative h-12 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="flex items-center px-4 bg-red-500 text-white z-20 shrink-0 shadow-[4px_0_12px_rgba(239,68,68,0.3)] relative">
        <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
        <h3 className="text-xs font-bold font-mono tracking-wider">
          BREAKING NEWS
        </h3>
      </div>

      <div className="flex-grow relative z-10 h-12 overflow-hidden flex items-center group/ticker bg-red-500/5">
        <div className="animate-horizontal-ticker group-hover/ticker:pause">
          {/* Duplicate the list to create a seamless loop */}
          {[...breakingArticles, ...breakingArticles].map((art, i) => (
            <div
              key={`${art.id}-${i}`}
              onClick={() => handleOpenArticle(art)}
              className="group cursor-pointer inline-flex items-center px-6 hover:bg-red-500/10 transition-colors h-12 border-r border-red-500/20 whitespace-nowrap shrink-0"
            >
              <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase mr-3 shrink-0">{art.category}</span>
              <span className="text-[13px] font-normal font-mono tracking-wider group-hover:text-red-500 transition-colors text-portal-text-main shrink-0">{art.title}</span>
              <span className="text-[10px] italic text-portal-text-muted opacity-80 ml-3 shrink-0">{art.date} • {art.readTime}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookmarkedArticlesCard({
  bookmarks,
  trendingArticles,
  personalizedArticles,
  handleOpenArticle
}: {
  bookmarks: string[],
  trendingArticles: NewsArticle[],
  personalizedArticles: NewsArticle[],
  handleOpenArticle: (art: NewsArticle) => void
}) {
  if (bookmarks.length === 0) return null;
  return (
    <section id="bookmarked-articles-card" className="border p-5 transition-all bg-portal-surface border-portal-border shadow-sm">
      <h3 className="text-[13px] font-sans font-normal tracking-wider uppercase mb-3 flex items-center space-x-1.5 text-portal-brand">
        <BookMarked size={14} className="text-yellow-500" />
        <span>DECKED ANALYSIS FOCUS</span>
      </h3>
      <div className="space-y-3">
        {bookmarks.map((bId) => {
          const article = [...trendingArticles, ...personalizedArticles].find(a => a.id === bId);
          if (!article) return null;
          return (
            <div
              key={bId}
              onClick={() => handleOpenArticle(article)}
              className="text-xs group cursor-pointer border-l-2 border-yellow-500/40 pl-2 pb-1 hover:border-yellow-500"
            >
              <div className="font-sans text-[10px] uppercase text-portal-text-muted">{article.category}</div>
              <div className="font-normal text-[13px] group-hover:text-portal-brand transition-colors line-clamp-1 text-portal-text-main">
                {article.title}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function UpcomingFixturesCard() {
  const [fixtures, setFixtures] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/cricket/fixtures')
      .then(res => res.json())
      .then(data => {
        setFixtures(data.matches?.slice(0, 4) || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section id="upcoming-matches-card" className="border-2 p-5 transition-all bg-portal-surface border-blue-500/30 shadow-lg shadow-blue-500/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 blur-2xl pointer-events-none"></div>
      <h3 className="text-[13px] font-normal font-sans tracking-wider uppercase mb-4 text-blue-500 relative z-10 flex items-center">
        <span className="w-1.5 h-4 bg-blue-500 mr-2"></span>
        UPCOMING FIXTURES
      </h3>
      <div className="space-y-3 relative z-10">
        {fixtures.length === 0 ? (
          <div className="text-center py-6 text-[11px] font-sans text-portal-text-muted/60 border border-dashed border-blue-500/20">
            No upcoming fixtures available.
          </div>
        ) : (
          fixtures.map((match: any, idx: number) => (
            <div key={idx} className="group cursor-pointer border-l-4 border-blue-500/30 pl-3 py-2.5 -ml-2 hover:bg-blue-500/5 hover:border-blue-500 transition-all border border-transparent hover:border-y-blue-500/10 hover:border-r-blue-500/10 hover:shadow-sm">
              <div className="text-[11px] font-sans text-blue-500 mb-0.5 font-normal tracking-widest">{match.matchType || match.format}</div>
              <div className="text-[13px] font-normal group-hover:text-blue-500 transition-colors text-portal-text-main font-sans">{match.title || `${match.team1} vs ${match.team2}`}</div>
              <div className="text-[11px] italic mt-1 text-portal-text-muted opacity-80 font-sans">{match.date}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function TopScorersCard() {
  const [scorers, setScorers] = React.useState<any[]>([]);
  const [isMock, setIsMock] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/football/wc2026/scorers')
      .then(res => res.json())
      .then(data => {
        setScorers(data.scorers?.slice(0, 4) || []);
        setIsMock(data.isMock || false);
      })
      .catch(err => console.error('Failed to fetch top scorers', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="relative overflow-hidden border bg-portal-surface border-portal-border p-5">
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-portal-border pb-3">
        <h3 className="flex items-center text-[13px] font-semibold tracking-wider text-portal-text-main uppercase">
          TOP SCORERS
        </h3>
        {isMock && !isLoading && (
          <span className="text-[9px] uppercase tracking-widest bg-portal-bg text-portal-text-muted px-2 py-0.5 border border-portal-border/50">Mock</span>
        )}
      </div>
      <div className="space-y-3 relative z-10">
        {scorers.length > 0 ? (
          scorers.map((scorer, idx) => (
            <div key={idx} className="group flex items-center justify-between p-2 bg-portal-bg border border-portal-border hover:bg-portal-surface-hover transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <img 
                  src={scorer.playerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(scorer.name)}&background=222&color=fff&rounded=true&size=128`}
                  alt={scorer.name}
                  className="w-8 h-8 rounded-full border border-portal-border object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scorer.name)}&background=222&color=fff&rounded=true&size=128`; }}
                />
                <div>
                  <div className="text-[13px] font-medium text-portal-text-main transition-colors">{scorer.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {scorer.flag && <img src={scorer.flag} className="w-3 h-3 object-contain" alt="" />}
                    <div className="text-[10px] text-portal-text-muted tracking-wider uppercase">{scorer.team}</div>
                  </div>
                </div>
              </div>
              <div className="text-xl font-bold text-portal-text-main transition-transform">{scorer.goals}</div>
            </div>
          ))
        ) : !isLoading ? (
          <div className="text-center py-6 text-[12px] text-portal-text-muted border border-dashed border-portal-border">
            No stats available yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}

import { BrandLogoPlaceholder } from './BrandLogoPlaceholder';

export function ThumbnailNewsCard({ relatedArticles, handleOpenArticle, failedImages = [] }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
  const validArticles = [...relatedArticles].slice(0, 12);
  if (validArticles.length === 0) return null;

  return (
    <section className="border p-5 transition-all bg-portal-surface border-portal-border shadow-sm">
      <h3 className="text-[13px] font-normal font-sans tracking-wider uppercase mb-4 flex items-center space-x-1.5 text-portal-brand border-b border-portal-border/50 pb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-portal-accent"></span>
        <span>HIGHLIGHTS</span>
      </h3>
      <div className="space-y-4">
        {validArticles.map((art, index) => {
          if (index % 3 === 0) {
            return (
              <div key={art.id} className={index > 0 ? "border-t border-portal-border/30 pt-4" : ""}>
                <div
                  onClick={() => handleOpenArticle(art)}
                  className="relative cursor-pointer group rounded overflow-hidden h-48 shadow-md"
                >
                  {art.imageUrl && !failedImages.includes(art.id) ? (
                    <img src={art.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                  ) : (
                    <BrandLogoPlaceholder article={art} iconSizeClass="w-20 h-20" textSizeClass="text-5xl" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <span className="text-[11px] font-normal font-sans text-[#c9a84c] mb-1 tracking-wider uppercase inline-block">{art.category}</span>
                    <h4 className="text-[15px] font-serif font-bold leading-tight text-white line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={art.id} onClick={() => handleOpenArticle(art)} className="flex items-center gap-3 cursor-pointer group border-t border-portal-border/30 pt-4">
                <div className="w-14 h-14 shrink-0 overflow-hidden rounded shadow-sm border border-portal-border/20">
                  {art.imageUrl && !failedImages.includes(art.id) ? (
                    <img src={art.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  ) : (
                    <BrandLogoPlaceholder article={art} iconSizeClass="w-8 h-8" textSizeClass="text-2xl" textMarginClass="mt-0 hidden" />
                  )}
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                  <h4 className="text-[13px] font-normal leading-snug group-hover:text-portal-brand transition-colors text-portal-text-main line-clamp-3">
                    {art.title}
                  </h4>
                </div>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}

export function TrendingTopicsCard({ relatedArticles, handleOpenArticle, failedImages = [] }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
  const trendArticles = relatedArticles.filter(art => !art.imageUrl || failedImages.includes(art.id)).slice(0, 5);

  if (trendArticles.length === 0) return null;

  return (
    <section id="trending-topics-card" className="border p-5 transition-all bg-portal-surface border-portal-border shadow-sm mt-6">
      <h3 className="text-[13px] font-normal font-sans tracking-wider uppercase mb-4 flex items-center space-x-2 text-portal-brand border-b border-portal-border/50 pb-2">
        <span className="w-1.5 h-4 bg-portal-brand"></span>
        <span>OTHERS IN TREND</span>
      </h3>
      <div className="space-y-4 mt-4">
        {trendArticles.map((art, index) => (
          <div key={art.id} onClick={() => handleOpenArticle(art)} className="group cursor-pointer flex items-start gap-4">
            <div className="text-3xl font-black text-portal-text-muted/30 group-hover:text-portal-brand transition-colors leading-none w-6 shrink-0 text-right font-serif italic">
              {index + 1}
            </div>
            <div className="flex flex-col gap-1 mt-0.5">
              <h4 className="text-[13px] sm:text-[14px] font-normal leading-snug text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-2">
                {art.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-sans text-portal-brand font-normal tracking-widest uppercase">{art.category}</span>
                <span className="text-[10px] text-portal-text-muted/60 font-sans tracking-tighter">• {art.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProAdCard() {
  return (
    <section id="pro-ad-card" className="border overflow-hidden shadow-xl transition-all border-portal-border bg-portal-surface hover:border-amber-500/40 cursor-pointer group relative">
      <div className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg px-1.5 py-0.5 border border-portal-border/50 z-10">Ad</div>

      {/* Visual banner */}
      <div className="w-full h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' }} />
        <div className="text-center relative z-10">
          <div className="text-white text-xl font-black tracking-tight">MarketPulse</div>
          <div className="text-white/80 text-[9px] font-mono uppercase tracking-widest mt-0.5">Real-Time Financial Data</div>
        </div>
        <div className="absolute top-2 left-2 bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 ">LIVE</div>
      </div>

      <div className="p-3">
        <p className="text-xs font-black leading-tight text-portal-text-main group-hover:text-amber-500 transition-colors">
          Track Stocks, Forex & Crypto in Real-Time
        </p>
        <p className="text-[10px] text-portal-text-muted mt-1 line-clamp-2 leading-relaxed">
          Institutional-grade market intelligence for retail investors. 140+ exchanges covered globally.
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex gap-0.5">
            {['AAPL', 'BTC', 'EUR'].map(t => (
              <span key={t} className="text-[8px] font-mono font-bold bg-portal-bg border border-portal-border/50 px-1.5 py-0.5 text-portal-text-muted">{t}</span>
            ))}
          </div>
          <button className="ml-auto text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 hover:opacity-90 transition-opacity">
            Start Free
          </button>
        </div>
      </div>
    </section>
  );
}

export function GoogleNewsPanel({ googleArticles, handleOpenArticle, failedImages = [] }: { googleArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
  if (!googleArticles || googleArticles.length === 0) return null;

  return (
    <section id="google-news-card" className="border p-4 transition-all bg-portal-surface border-portal-border shadow-sm rounded-xl mt-6">
      <h3 className="text-[13px] font-normal font-sans tracking-wider uppercase mb-2 flex items-center space-x-2 text-[#4285F4] border-b border-portal-border/50 pb-2">
        <span className="w-1.5 h-4 bg-[#4285F4]"></span>
        <span>GOOGLE NEWS FEEDS</span>
      </h3>
      <div className="space-y-0 divide-y divide-portal-border/30">
        {googleArticles.slice(0, 5).map((art) => (
          <div key={art.id} className="group overflow-hidden">
            <div onClick={() => handleOpenArticle(art)} className="py-3 cursor-pointer flex items-center justify-between hover:text-[#4285F4] transition-colors">
              <h4 className="text-[13px] font-normal leading-tight text-portal-text-main group-hover:text-[#4285F4] pr-4 line-clamp-2">{art.title}</h4>
              <span className="text-portal-text-muted group-hover:text-[#4285F4] shrink-0 text-[13px] transition-transform group-hover:-rotate-90">↓</span>
            </div>
            {/* Expanded content */}
            <div className="max-h-0 group-hover:max-h-48 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out flex gap-3 pb-0 group-hover:pb-3 cursor-pointer" onClick={() => handleOpenArticle(art)}>
              <div className="w-16 h-16 bg-[#4285F4]/5 rounded shadow-sm shrink-0 flex items-center justify-center p-2 border border-[#4285F4]/20">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-mono text-[#4285F4] tracking-wider uppercase mb-1">{art.category}</span>
                <span className="text-[10px] text-portal-text-muted line-clamp-2 leading-tight">
                  Published {art.date}. Click to read full article coverage on Google News.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrendNewsPanel({ trendArticles, handleOpenArticle, failedImages = [] }: { trendArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
  if (!trendArticles || trendArticles.length === 0) return null;

  return (
    <section id="trend-news-card" className="mt-6 mb-8">
      <div className="space-y-3.5">
        {trendArticles.slice(0, 10).map((art, index) => (
          <div
            key={art.id}
            onClick={() => handleOpenArticle(art)}
            className="group cursor-pointer flex items-center gap-3.5 p-3 sm:p-3.5 bg-portal-surface border border-portal-border/60 shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] hover:border-portal-brand/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {art.imageUrl && !failedImages.includes(art.id) ? (
              <div className="w-12 h-12 shrink-0 overflow-hidden shadow-sm bg-portal-bg">
                <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-12 h-12 shrink-0 overflow-hidden shadow-sm bg-portal-bg border border-portal-border/50">
                <BrandLogoPlaceholder article={art} iconSizeClass="w-6 h-6" textSizeClass="text-xl" textMarginClass="mt-0 hidden" />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <h4 className="text-[12px] sm:text-[13px] font-semibold leading-snug text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-2">
                {art.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] font-bold text-portal-brand uppercase tracking-wider">{art.category}</span>
                <span className="text-[9px] text-portal-text-muted/70 font-mono tracking-tighter">{art.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecentVideosCard() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news/videos')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setVideos(data.slice(0, 4));
        }
      })
      .catch(console.error);
  }, []);

  if (videos.length === 0) return null;

  const handleVideoClick = (vid: any) => {
    window.dispatchEvent(new CustomEvent('playGlobalVideo', { detail: vid }));
  };

  return (
    <section className="bg-portal-surface border-y sm:border border-portal-border/50 sm:shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-portal-border/50 bg-portal-surface/50">
        <div className="flex items-center gap-2 text-portal-text-main font-black uppercase text-[10px] tracking-widest font-sans">
          <PlayCircle size={14} className="text-portal-brand" />
          Recent Video Feeds
        </div>
      </div>
      <div className="divide-y divide-portal-border/50 flex-1 overflow-y-auto">
        {videos.map(vid => (
          <div key={vid.id} className="p-3 sm:p-4 hover:bg-portal-surface-hover transition-colors group cursor-pointer flex gap-3" onClick={() => handleVideoClick(vid)}>
            <div className="w-20 h-14 bg-portal-bg shrink-0 relative overflow-hidden border border-portal-border/50">
              <img src={vid.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <PlayCircle size={16} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-bold text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-2 leading-tight mb-1">
                {vid.title}
              </h4>
              <span className="text-[10px] font-mono text-portal-text-muted">{vid.source} • {vid.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecentSportVideosCard() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news/videos')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          // Just taking a different slice to mock sport related feeds
          setVideos(data.slice(2, 6));
        }
      })
      .catch(console.error);
  }, []);

  if (videos.length === 0) return null;

  const handleVideoClick = (vid: any) => {
    window.dispatchEvent(new CustomEvent('playGlobalVideo', { detail: vid }));
  };

  return (
    <section className="bg-portal-surface border-y sm:border border-portal-border/50 sm:shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-portal-border/50 bg-portal-surface/50">
        <div className="flex items-center gap-2 text-portal-text-main font-black uppercase text-[10px] tracking-widest font-sans">
          <PlayCircle size={14} className="text-portal-brand" />
          Recent Sport Video Feeds
        </div>
      </div>
      <div className="divide-y divide-portal-border/50 flex-1 overflow-y-auto">
        {videos.map(vid => (
          <div key={vid.id} className="p-3 sm:p-4 hover:bg-portal-surface-hover transition-colors group cursor-pointer flex gap-3" onClick={() => handleVideoClick(vid)}>
            <div className="w-20 h-14 bg-portal-bg shrink-0 relative overflow-hidden border border-portal-border/50">
              <img src={vid.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <PlayCircle size={16} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h4 className="text-xs font-bold text-portal-text-main group-hover:text-portal-brand transition-colors line-clamp-2 leading-tight mb-1">
                {vid.title}
              </h4>
              <span className="text-[10px] font-mono text-portal-text-muted">{vid.source} • {vid.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const formatAndSortMatches = (matches: any[]) => {
  return (matches || []).map((m: any) => {
    if (m.team1 && m.team2 && m.team1.localeCompare(m.team2) > 0) {
      return { 
        ...m, 
        team1: m.team2, 
        team2: m.team1, 
        score1: m.score2, 
        score2: m.score1, 
        flag1: m.flag2, 
        flag2: m.flag1, 
        winner: m.winner === 'HOME_TEAM' ? 'AWAY_TEAM' : (m.winner === 'AWAY_TEAM' ? 'HOME_TEAM' : m.winner) 
      };
    }
    return m;
  });
};

const SkeletonLoader = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-[72px] bg-portal-border/30 rounded border border-portal-border/50"></div>
    ))}
  </div>
);
export function FifaLiveMatchesCard() {
  const [matches, setMatches] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMatches = () => {
      fetch('/api/football/wc2026?status=IN_PLAY')
        .then(res => res.json())
        .then(data => {
          const sorted = formatAndSortMatches(data.matches);
          setMatches(sorted.slice(0, 4));
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    };
    
    fetchMatches();
    const interval = setInterval(fetchMatches, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative overflow-hidden border bg-portal-surface border-portal-border p-5">
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-portal-border pb-3">
        <h3 className="flex items-center text-[13px] font-semibold tracking-wider text-portal-text-main uppercase">
          <span className="relative flex h-2 w-2 mr-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE ACTION
        </h3>
        <span className="bg-portal-bg px-2 py-0.5 text-[9px] font-medium text-portal-text-main border border-portal-border uppercase tracking-widest">FIFA WC26</span>
      </div>
      
      <div className="relative z-10 flex flex-col gap-3">
        {isLoading ? (
          <SkeletonLoader />
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-portal-border bg-portal-bg py-8 text-center">
            <span className="mb-2 text-xl opacity-30 grayscale">⚽</span>
            <span className="text-[11px] text-portal-text-muted">No live matches right now</span>
          </div>
        ) : (
          matches.map((match: any, idx: number) => (
            <div key={idx} className="group relative overflow-hidden border border-portal-border bg-portal-bg p-3.5 transition-all duration-300 hover:border-portal-brand/50 hover:bg-portal-surface-hover">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center text-[9px] font-bold tracking-widest text-emerald-500">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full animate-pulse bg-emerald-500" aria-hidden="true"></span>
                  {match.status}
                </span>
                <span className="text-[10px] text-portal-text-muted">{match.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5 text-[14px] font-semibold text-portal-text-main uppercase tracking-wide min-w-0">
                  <span className="flex items-center gap-2 truncate">
                    {match.flag1 && <img src={match.flag1} className="w-3.5 h-3.5 object-contain" alt="" />}
                    <span className="truncate">{match.team1}</span>
                  </span>
                  <span className="flex items-center gap-2 truncate">
                    {match.flag2 && <img src={match.flag2} className="w-3.5 h-3.5 object-contain" alt="" />}
                    <span className="truncate">{match.team2}</span>
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-right text-[16px] font-bold tracking-tight text-portal-text-main transition-colors ml-4 shrink-0">
                  <span>{match.score1}</span>
                  <span>{match.score2}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function FifaUpcomingFixturesCard() {
  const [fixtures, setFixtures] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/football/wc2026?status=SCHEDULED')
      .then(res => res.json())
      .then(data => {
        const sorted = formatAndSortMatches(data.matches);
        setFixtures(sorted.slice(0, 4));
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);
  
  return (
    <section className="relative overflow-hidden border bg-portal-surface border-portal-border p-5">
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-portal-border pb-3">
        <h3 className="flex items-center text-[13px] font-semibold tracking-wider text-portal-text-main uppercase">
          UPCOMING FIXTURES
        </h3>
      </div>
      
      <div className="relative z-10 flex flex-col gap-3">
        {isLoading ? (
          <SkeletonLoader />
        ) : fixtures.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-portal-border bg-portal-bg py-8 text-center">
            <span className="text-[11px] text-portal-text-muted">No upcoming fixtures</span>
          </div>
        ) : (
          fixtures.map((match: any, idx: number) => (
            <div key={idx} className="group relative overflow-hidden border border-portal-border bg-portal-bg p-3 transition-all duration-300 hover:border-portal-brand/50 hover:bg-portal-surface-hover">
              <div className="mb-2 text-[9px] font-semibold tracking-widest text-portal-brand uppercase">{match.date}</div>
              <div className="flex items-center justify-between text-[13px] font-medium text-portal-text-main transition-colors min-w-0">
                <span className="flex items-center gap-1.5 truncate">
                  {match.flag1 && <img src={match.flag1} className="w-3.5 h-3.5 object-contain shrink-0" alt="" />}
                  <span className="truncate">{match.team1}</span>
                </span>
                <span className="text-[9px] text-portal-text-muted italic mx-2 shrink-0">vs</span>
                <span className="flex items-center gap-1.5 flex-row-reverse truncate">
                  {match.flag2 && <img src={match.flag2} className="w-3.5 h-3.5 object-contain shrink-0" alt="" />}
                  <span className="truncate">{match.team2}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function FifaResultsCard() {
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/football/wc2026?status=FINISHED')
      .then(res => res.json())
      .then(data => {
        const sorted = formatAndSortMatches(data.matches);
        setResults(sorted.slice(0, 4));
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);
  
  return (
    <section className="relative overflow-hidden border bg-portal-surface border-portal-border p-5">
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-portal-border pb-3">
        <h3 className="flex items-center text-[13px] font-semibold tracking-wider text-portal-text-main uppercase">
          LATEST RESULTS
        </h3>
      </div>
      
      <div className="relative z-10 flex flex-col gap-3">
        {isLoading ? (
          <SkeletonLoader />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-portal-border bg-portal-bg py-8 text-center">
            <span className="text-[11px] text-portal-text-muted">No results available</span>
          </div>
        ) : (
          results.map((match: any, idx: number) => (
            <div key={idx} className="group relative overflow-hidden border border-portal-border bg-portal-bg p-3.5 transition-all duration-300 hover:border-portal-brand/50 hover:bg-portal-surface-hover flex items-center justify-between">
              <div className="flex flex-col gap-2 w-full min-w-0">
                <span className="text-[9px] font-medium tracking-widest text-portal-text-muted uppercase">{match.status} • {match.date}</span>
                
                <div className="flex items-center justify-between text-[13px] font-semibold text-portal-text-main">
                  <span className={`flex items-center gap-2 truncate ${match.winner === 'AWAY_TEAM' ? 'opacity-40' : ''}`}>
                    {match.flag1 && <img src={match.flag1} className="w-3.5 h-3.5 object-contain shrink-0" alt="" />}
                    <span className="truncate">{match.team1}</span>
                  </span>
                  <span className={`text-[15px] ml-4 shrink-0 ${match.winner === 'AWAY_TEAM' ? 'opacity-40 font-normal' : 'font-bold'}`}>{match.score1}</span>
                </div>
                
                <div className="flex items-center justify-between text-[13px] font-semibold text-portal-text-main">
                  <span className={`flex items-center gap-2 truncate ${match.winner === 'HOME_TEAM' ? 'opacity-40' : ''}`}>
                    {match.flag2 && <img src={match.flag2} className="w-3.5 h-3.5 object-contain shrink-0" alt="" />}
                    <span className="truncate">{match.team2}</span>
                  </span>
                  <span className={`text-[15px] ml-4 shrink-0 ${match.winner === 'HOME_TEAM' ? 'opacity-40 font-normal' : 'font-bold'}`}>{match.score2}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
