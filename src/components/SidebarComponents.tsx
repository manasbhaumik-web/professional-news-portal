import React from 'react';
import { BookMarked } from 'lucide-react';
import { NewsArticle } from '../types';

export function SidebarAdvertisement() {
 return (
 <section id="sidebar-advertisement" className="border overflow-hidden bg-portal-surface border-portal-border shadow-sm hover:border-portal-brand/40 transition-all cursor-pointer group relative">
 <div className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg px-1.5 py-0.5 border border-portal-border/50 z-10">Sponsored</div>

 {/* Hero banner */}
 <div className="w-full h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center relative overflow-hidden">
 <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
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
 <h3 className="text-xs font-bold font-mono tracking-wider flex items-center text-portal-text-main">
 <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
 ONGOING ICC SERIES
 </h3>
 <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 font-mono uppercase tracking-widest font-bold ring-1 ring-blue-500/30">Live</span>
 </header>
 <div className="p-4 space-y-4 relative z-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40">
 {cricketIsMock && (
 <div className="absolute top-0 right-0 m-2">
 <span className="flex items-center gap-1 text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
 <span className="w-1.5 h-1.5 bg-amber-500 "></span>Demo
 </span>
 </div>
 )}
 {cricketMatches.map((series, idx) => (
 <div key={idx} className="flex gap-3 cursor-pointer group p-2 -m-2 hover:bg-blue-500/5 transition-colors border border-transparent hover:border-blue-500/10">
 <div className="mt-1 shrink-0 w-1.5 h-1.5 bg-blue-500"></div>
 <div className="text-xs w-full pr-2">
 <p className="font-semibold leading-snug text-portal-text-main group-hover:text-blue-500 transition-colors">{series.title}</p>
 {series.score && (
 <p className="text-[11px] font-mono text-blue-400 mt-1 mb-0.5 font-bold tracking-tight">{series.score}</p>
 )}
 <p className="text-[10px] font-mono text-portal-text-muted mt-0.5">{series.matches} • <span className="text-portal-text-main/70">{series.status}</span></p>
 </div>
 </div>
 ))}
 </div>
 </section>
 );
}

export function BreakingNewsTicker({ relatedArticles, handleOpenArticle }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void }) {
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
                {[...relatedArticles
                    .filter(art => {
                        if (!art.publishedAt) return true;
                        const diff = Date.now() - new Date(art.publishedAt).getTime();
                        return diff <= 3 * 60 * 60 * 1000;
                    })
                    .slice(0, 10),
                 ...relatedArticles
                    .filter(art => {
                        if (!art.publishedAt) return true;
                        const diff = Date.now() - new Date(art.publishedAt).getTime();
                        return diff <= 3 * 60 * 60 * 1000;
                    })
                    .slice(0, 10)
                ].map((art, i) => (
                    <div
                        key={`${art.id}-${i}`}
                        onClick={() => handleOpenArticle(art)}
                        className="group cursor-pointer inline-flex items-center px-6 hover:bg-red-500/10 transition-colors h-12 border-r border-red-500/20 whitespace-nowrap shrink-0"
                    >
                        <span className="text-[10px] font-mono text-red-500 font-bold tracking-widest uppercase mr-3 shrink-0">{art.category}</span>
                        <span className="text-[13px] font-semibold group-hover:text-red-500 transition-colors text-portal-text-main shrink-0">{art.title}</span>
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
 <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-3 flex items-center space-x-1.5 text-portal-brand">
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
 <div className="font-mono text-[9px] uppercase text-portal-text-muted">{article.category}</div>
 <div className="font-semibold group-hover:text-portal-brand transition-colors line-clamp-1 text-portal-text-main">
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
 return (
 <section id="upcoming-matches-card" className="border-2 p-5 transition-all bg-portal-surface border-blue-500/30 shadow-lg shadow-blue-500/10 relative overflow-hidden">
 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 blur-2xl pointer-events-none"></div>
 <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-blue-500 relative z-10 flex items-center">
 <span className="w-1.5 h-4 bg-blue-500 mr-2"></span>
 UPCOMING FIXTURES
 </h3>
 <div className="space-y-3 relative z-10">
 {[
 { team1: 'IND', team2: 'SL', date: 'Tomorrow, 14:00 GMT', format: '3rd T20I' },
 { team1: 'SA', team2: 'WI', date: 'Jun 16, 10:00 GMT', format: '1st ODI' },
 { team1: 'ENG', team2: 'PAK', date: 'Jun 18, 18:30 GMT', format: '1st T20I' },
 { team1: 'AUS', team2: 'NZ', date: 'Jun 20, 00:30 GMT', format: '2nd Test' }
 ].map((match, idx) => (
 <div key={idx} className="group cursor-pointer border-l-4 border-blue-500/30 pl-3 py-2.5 -ml-2 hover:bg-blue-500/5 hover:border-blue-500 transition-all border border-transparent hover:border-y-blue-500/10 hover:border-r-blue-500/10 hover:shadow-sm">
 <div className="text-[10px] font-mono text-blue-500 mb-0.5 font-bold tracking-widest">{match.format}</div>
 <div className="text-xs font-semibold group-hover:text-blue-500 transition-colors text-portal-text-main">{match.team1} vs {match.team2}</div>
 <div className="text-[10px] italic mt-1 text-portal-text-muted opacity-80">{match.date}</div>
 </div>
 ))}
 </div>
 </section>
 );
}

export function TopScorersCard() {
 return (
 <section id="top-scorers-card" className="border-2 p-5 transition-all bg-portal-surface border-[#c9a84c]/30 shadow-lg shadow-[#c9a84c]/10 relative overflow-hidden">
 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c9a84c]/5 blur-2xl pointer-events-none"></div>
 <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-[#c9a84c] relative z-10 flex items-center">
 <span className="w-1.5 h-4 bg-[#c9a84c] mr-2"></span>
 TOP GOAL SCORERS
 </h3>
 <div className="space-y-3 relative z-10">
 {[
 { name: 'Kylian Mbappé', team: 'France', goals: 8, flag: 'fr' },
 { name: 'Lionel Messi', team: 'Argentina', goals: 7, flag: 'ar' },
 { name: 'Julián Álvarez', team: 'Argentina', goals: 4, flag: 'ar' },
 { name: 'Olivier Giroud', team: 'France', goals: 4, flag: 'fr' }
 ].map((scorer, idx) => (
 <div key={idx} className="group flex items-center justify-between border-l-4 border-[#c9a84c]/30 pl-3 py-2.5 -ml-2 hover:bg-[#c9a84c]/5 hover:border-[#c9a84c] transition-all border border-transparent hover:border-y-[#c9a84c]/10 hover:border-r-[#c9a84c]/10 hover:shadow-sm">
 <div>
 <div className="text-[10px] font-mono text-[#c9a84c] mb-0.5 font-bold tracking-widest">{idx + 1} • {scorer.team}</div>
 <div className="text-xs font-semibold group-hover:text-[#c9a84c] transition-colors text-portal-text-main">{scorer.name}</div>
 </div>
 <div className="text-lg font-black font-mono text-[#c9a84c]">{scorer.goals}</div>
 </div>
 ))}
 </div>
 </section>
 );
}

export function ThumbnailNewsCard({ relatedArticles, handleOpenArticle, failedImages = [] }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
 const validArticles = [...relatedArticles].filter(a => a.imageUrl && !failedImages.includes(a.id)).slice(0, 6);
 if (validArticles.length === 0) return null;
 
 const heroArticle = validArticles[0];
 const listArticles = validArticles.slice(1);

 return (
 <section className="border p-5 transition-all bg-portal-surface border-portal-border shadow-sm">
 <h3 className="text-xs font-normal font-mono tracking-wider uppercase mb-4 flex items-center space-x-1.5 text-portal-brand border-b border-portal-border/50 pb-2">
 <span className="w-1.5 h-1.5 rounded-full bg-portal-accent"></span>
 <span>HIGHLIGHTS</span>
 </h3>
 <div className="space-y-4">
 {/* Hero Item */}
 {heroArticle && (
 <div 
 key={heroArticle.id} 
 onClick={() => handleOpenArticle(heroArticle)}
 className="relative cursor-pointer group rounded overflow-hidden h-48 shadow-md"
 >
 <img src={heroArticle.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
 <div className="absolute bottom-0 left-0 p-4 w-full">
 <span className="text-[10px] font-bold font-mono text-[#c9a84c] mb-1 tracking-wider uppercase inline-block">{heroArticle.category}</span>
 <h4 className="text-sm font-serif font-bold leading-tight text-white line-clamp-2">
 {heroArticle.title}
 </h4>
 </div>
 </div>
 )}
 {/* Sub Items */}
 {listArticles.map((art, idx) => (
 <div key={art.id} onClick={() => handleOpenArticle(art)} className="flex items-center gap-4 cursor-pointer group border-t border-portal-border/30 pt-4">
 <div className="text-2xl font-serif font-black text-portal-text-muted/20 w-4 shrink-0 text-center">{idx + 2}</div>
 <div className="flex flex-col flex-grow min-w-0">
 <h4 className="text-xs font-normal leading-tight group-hover:text-portal-brand transition-colors text-portal-text-main line-clamp-2">
 {art.title}
 </h4>
 </div>
 </div>
 ))}
 </div>
 </section>
 );
}

export function TrendingTopicsCard({ relatedArticles, handleOpenArticle, failedImages = [] }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
 const trendArticles = relatedArticles.filter(art => !art.imageUrl || failedImages.includes(art.id)).slice(0, 4);
 
 if (trendArticles.length === 0) return null;

 return (
  <section id="trending-topics-card" className="border p-5 transition-all bg-portal-surface border-portal-border shadow-sm">
   <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 flex items-center space-x-2 text-[#ef4444] border-b border-portal-border/50 pb-2">
     <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></span>
     <span>OTHERS IN TREND</span>
   </h3>
   <div className="relative pl-3 space-y-5">
     <div className="absolute left-[3.5px] top-2 bottom-2 w-px bg-portal-border/60"></div>
     {trendArticles.map((art) => (
       <div key={art.id} onClick={() => handleOpenArticle(art)} className="relative cursor-pointer group pl-5">
         <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-portal-surface border border-[#ef4444] group-hover:bg-[#ef4444] transition-colors shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
         <div className="flex flex-col flex-grow min-w-0">
           <div className="flex items-center gap-2 mb-1.5">
             <span className="text-[9px] font-bold font-mono text-[#ef4444] tracking-widest uppercase bg-[#ef4444]/10 px-1 py-0.5 rounded-sm">{art.category}</span>
             <span className="text-[9px] text-portal-text-muted font-mono uppercase tracking-widest">{art.date}</span>
           </div>
           <h4 className="text-xs font-normal leading-tight group-hover:text-[#ef4444] transition-colors text-portal-text-main line-clamp-2">
             {art.title}
           </h4>
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
 <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'}} />
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
    <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-2 flex items-center space-x-2 text-[#4285F4] border-b border-portal-border/50 pb-2">
      <span className="w-1.5 h-4 bg-[#4285F4]"></span>
      <span>GOOGLE NEWS FEEDS</span>
    </h3>
    <div className="space-y-0 divide-y divide-portal-border/30">
      {googleArticles.slice(0, 5).map((art) => (
        <div key={art.id} className="group overflow-hidden">
          <div onClick={() => handleOpenArticle(art)} className="py-3 cursor-pointer flex items-center justify-between hover:text-[#4285F4] transition-colors">
            <h4 className="text-xs font-normal leading-tight text-portal-text-main group-hover:text-[#4285F4] pr-4 line-clamp-2">{art.title}</h4>
            <span className="text-portal-text-muted group-hover:text-[#4285F4] shrink-0 text-xs transition-transform group-hover:-rotate-90">↓</span>
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
