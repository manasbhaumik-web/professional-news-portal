import React from 'react';
import { BookMarked } from 'lucide-react';
import { NewsArticle } from '../types';

export function SidebarAdvertisement() {
  return (
    <section id="sidebar-advertisement" className="border rounded-xl overflow-hidden bg-portal-surface border-portal-border shadow-sm hover:border-portal-brand/40 transition-all cursor-pointer group relative">
      <div className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg px-1.5 py-0.5 rounded border border-portal-border/50 z-10">Sponsored</div>

      {/* Hero banner */}
      <div className="w-full h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
        <div className="text-white text-2xl font-black tracking-tight mb-0.5">Horizon Intelligence</div>
        <div className="text-white/80 text-[10px] font-mono uppercase tracking-widest">Premium Suite 2026</div>
        <div className="absolute bottom-2 right-2 bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</div>
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
          <button className="text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity">
            Try Free
          </button>
        </div>
      </div>
    </section>
  );
}


export function OngoingIccSeriesCard({ cricketIsMock, cricketMatches }: { cricketIsMock: boolean, cricketMatches: any[] }) {
  return (
    <section id="ongoing-icc-series-card" className="border-2 rounded-xl flex flex-col overflow-hidden transition-all bg-portal-surface border-blue-500/40 shadow-lg shadow-blue-500/10 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <header className="p-4 border-b flex items-center justify-between border-blue-500/30 bg-blue-500/5 relative z-10">
        <h3 className="text-xs font-bold font-mono tracking-wider flex items-center text-portal-text-main">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          ONGOING ICC SERIES
        </h3>
        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold ring-1 ring-blue-500/30">Live</span>
      </header>
      <div className="p-4 space-y-4 relative z-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40">
        {cricketIsMock && (
          <div className="absolute top-0 right-0 m-2">
            <span className="flex items-center gap-1 text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Demo
            </span>
          </div>
        )}
        {cricketMatches.map((series, idx) => (
          <div key={idx} className="flex gap-3 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-blue-500/5 transition-colors border border-transparent hover:border-blue-500/10">
            <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
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

export function BreakingNewsCard({ relatedArticles, handleOpenArticle }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void }) {
  return (
    <section id="alerts-sidebar-card" className="border-2 rounded-xl flex flex-col overflow-hidden transition-all bg-portal-surface border-red-500/40 shadow-lg shadow-red-500/10 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <header className="p-4 border-b flex items-center justify-between border-red-500/30 bg-red-500/5 relative z-10">
        <h3 className="text-[13px] font-bold font-mono tracking-wider flex items-center text-portal-text-main">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          BREAKING NEWS
        </h3>
        <span className="text-[9px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest font-bold ring-1 ring-red-500/30">Live</span>
      </header>
      <div className="p-4 space-y-[2pt] relative z-10">
        {relatedArticles
          .filter(art => {
            if (!art.publishedAt) return true;
            const diff = Date.now() - new Date(art.publishedAt).getTime();
            return diff <= 3 * 60 * 60 * 1000;
          })
          .slice(0, 3)
          .map((art) => (
            <div
              key={art.id}
              onClick={() => handleOpenArticle(art)}
              className="group cursor-pointer border-l-4 border-red-500/30 pl-3 py-2.5 -ml-2 rounded-r-lg hover:bg-red-500/5 hover:border-red-500 transition-all border border-transparent hover:border-y-red-500/10 hover:border-r-red-500/10 hover:shadow-sm"
            >
              <div className="text-[10px] font-mono text-red-500 mb-0.5 font-bold tracking-widest">{art.category}</div>
              <div className="text-xs font-semibold group-hover:text-red-500 transition-colors text-portal-text-main line-clamp-2">{art.title}</div>
              <div className="text-[10px] italic mt-1 text-portal-text-muted opacity-80">{art.date} • {art.readTime}</div>
            </div>
          ))}
      </div>
    </section>
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
    <section id="bookmarked-articles-card" className="border rounded-xl p-5 transition-all bg-portal-surface border-portal-border shadow-sm">
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
    <section id="upcoming-matches-card" className="border-2 rounded-xl p-5 transition-all bg-portal-surface border-blue-500/30 shadow-lg shadow-blue-500/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-blue-500 relative z-10 flex items-center">
        <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
        UPCOMING FIXTURES
      </h3>
      <div className="space-y-3 relative z-10">
        {[
          { team1: 'IND', team2: 'SL', date: 'Tomorrow, 14:00 GMT', format: '3rd T20I' },
          { team1: 'SA', team2: 'WI', date: 'Jun 16, 10:00 GMT', format: '1st ODI' },
          { team1: 'ENG', team2: 'PAK', date: 'Jun 18, 18:30 GMT', format: '1st T20I' },
          { team1: 'AUS', team2: 'NZ', date: 'Jun 20, 00:30 GMT', format: '2nd Test' }
        ].map((match, idx) => (
          <div key={idx} className="group cursor-pointer border-l-4 border-blue-500/30 pl-3 py-2.5 -ml-2 rounded-r-lg hover:bg-blue-500/5 hover:border-blue-500 transition-all border border-transparent hover:border-y-blue-500/10 hover:border-r-blue-500/10 hover:shadow-sm">
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
    <section id="top-scorers-card" className="border-2 rounded-xl p-5 transition-all bg-portal-surface border-[#c9a84c]/30 shadow-lg shadow-[#c9a84c]/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#c9a84c]/5 rounded-full blur-2xl pointer-events-none"></div>
      <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-[#c9a84c] relative z-10 flex items-center">
        <span className="w-1.5 h-4 bg-[#c9a84c] rounded-full mr-2"></span>
        TOP GOAL SCORERS
      </h3>
      <div className="space-y-3 relative z-10">
        {[
          { name: 'Kylian Mbappé', team: 'France', goals: 8, flag: 'fr' },
          { name: 'Lionel Messi', team: 'Argentina', goals: 7, flag: 'ar' },
          { name: 'Julián Álvarez', team: 'Argentina', goals: 4, flag: 'ar' },
          { name: 'Olivier Giroud', team: 'France', goals: 4, flag: 'fr' }
        ].map((scorer, idx) => (
          <div key={idx} className="group flex items-center justify-between border-l-4 border-[#c9a84c]/30 pl-3 py-2.5 -ml-2 rounded-r-lg hover:bg-[#c9a84c]/5 hover:border-[#c9a84c] transition-all border border-transparent hover:border-y-[#c9a84c]/10 hover:border-r-[#c9a84c]/10 hover:shadow-sm">
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

export function TrendingTopicsCard({ relatedArticles, handleOpenArticle, failedImages = [] }: { relatedArticles: NewsArticle[], handleOpenArticle: (art: NewsArticle) => void, failedImages?: string[] }) {
  return (
    <section id="trending-topics-card" className="border-2 rounded-xl p-5 transition-all bg-portal-surface border-portal-brand/30 shadow-lg shadow-portal-brand/10 relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-portal-brand/5 rounded-full blur-2xl pointer-events-none"></div>
      <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-portal-brand relative z-10 flex items-center">
        <span className="w-1.5 h-4 bg-portal-brand rounded-full mr-2"></span>
        OTHERS IN TREND
      </h3>
      <div className="space-y-3 relative z-10">
        {relatedArticles
          .filter(art => !art.imageUrl || failedImages.includes(art.id))
          .slice(0, 4)
          .map((art, idx) => (
          <div
            key={art.id}
            onClick={() => handleOpenArticle(art)}
            className="group cursor-pointer border-l-4 border-portal-brand/30 pl-3 py-2.5 -ml-2 rounded-r-lg hover:bg-portal-brand/5 hover:border-portal-brand transition-all border border-transparent hover:border-y-portal-brand/10 hover:border-r-portal-brand/10 hover:shadow-sm"
          >
            <div className="text-[10px] font-mono text-portal-brand mb-0.5 font-bold tracking-widest">{art.category}</div>
            <div className="text-xs font-semibold group-hover:text-portal-brand transition-colors text-portal-text-main line-clamp-2">{art.title}</div>
            <div className="text-[10px] italic mt-1 text-portal-text-muted opacity-80">{art.date} • {art.readTime}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProAdCard() {
  return (
    <section id="pro-ad-card" className="border rounded-xl overflow-hidden shadow-xl transition-all border-portal-border bg-portal-surface hover:border-amber-500/40 cursor-pointer group relative">
      <div className="absolute top-2 right-2 text-[7px] font-mono uppercase tracking-widest text-portal-text-muted bg-portal-bg px-1.5 py-0.5 rounded border border-portal-border/50 z-10">Ad</div>

      {/* Visual banner */}
      <div className="w-full h-24 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'}} />
        <div className="text-center relative z-10">
          <div className="text-white text-xl font-black tracking-tight">MarketPulse</div>
          <div className="text-white/80 text-[9px] font-mono uppercase tracking-widest mt-0.5">Real-Time Financial Data</div>
        </div>
        <div className="absolute top-2 left-2 bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">LIVE</div>
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
              <span key={t} className="text-[8px] font-mono font-bold bg-portal-bg border border-portal-border/50 px-1.5 py-0.5 rounded text-portal-text-muted">{t}</span>
            ))}
          </div>
          <button className="ml-auto text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full hover:opacity-90 transition-opacity">
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
    <section id="google-news-card" className="border-2 rounded-xl p-5 transition-all bg-portal-surface border-green-500/30 shadow-lg shadow-green-500/10 relative overflow-hidden mt-6">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/5 rounded-full blur-2xl pointer-events-none"></div>
      <h3 className="text-xs font-bold font-mono tracking-wider uppercase mb-4 text-green-500 relative z-10 flex items-center">
        <span className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
        GOOGLE NEWS FEEDS
      </h3>
      <div className="space-y-3 relative z-10">
        {googleArticles
          .filter(art => !art.imageUrl || failedImages.includes(art.id))
          .slice(0, 5)
          .map((art, idx) => (
          <div
            key={art.id}
            onClick={() => handleOpenArticle(art)}
            className="group cursor-pointer border-l-4 border-green-500/30 pl-3 py-2.5 -ml-2 rounded-r-lg hover:bg-green-500/5 hover:border-green-500 transition-all border border-transparent hover:border-y-green-500/10 hover:border-r-green-500/10 hover:shadow-sm"
          >
            <div className="text-[10px] font-mono text-green-500 mb-0.5 font-bold tracking-widest">{art.category}</div>
            <div className="text-xs font-semibold group-hover:text-green-500 transition-colors text-portal-text-main line-clamp-2">{art.title}</div>
            <div className="text-[10px] italic mt-1 text-portal-text-muted opacity-80">{art.date} • {art.readTime}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
