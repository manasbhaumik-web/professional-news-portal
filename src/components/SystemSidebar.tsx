import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookMarked, Trophy, RefreshCw, Clock, Tag } from 'lucide-react';
import { NewsArticle } from '../types';

interface SystemSidebarProps {
  bookmarks: string[];
  trendingArticles: NewsArticle[];
  personalizedArticles: NewsArticle[];
  relatedArticles: NewsArticle[];
  handleOpenArticle: (art: NewsArticle) => void;
  setActiveTab: (tab: any) => void;
  setSearchQuery: (query: string) => void;
  activeTab?: string;
  failedImages?: string[];
  selectedMenuCategory?: string;
  topHeadlineIds?: Set<string>;
}


import { SidebarAdvertisement, OngoingIccSeriesCard, BookmarkedArticlesCard, UpcomingFixturesCard, TopScorersCard, ThumbnailNewsCard, TrendingTopicsCard, ProAdCard, TrendNewsPanel, RecentVideosCard, RecentSportVideosCard, FifaLiveMatchesCard, FifaUpcomingFixturesCard, FifaResultsCard } from './SidebarComponents';

export default React.memo(function SystemSidebar({
  bookmarks,
  trendingArticles,
  personalizedArticles,
  relatedArticles,
  handleOpenArticle,
  setActiveTab,
  setSearchQuery,
  activeTab,
  failedImages = [],
  selectedMenuCategory,
  topHeadlineIds = new Set()
}: SystemSidebarProps) {
  const [cricketMatches, setCricketMatches] = useState<any[]>([]);


  useEffect(() => {
    fetch('/api/cricket/live')
      .then(res => res.json())
      .then(data => {
        setCricketMatches(data.matches || []);

      })
      .catch(err => console.error('Failed to fetch cricket live data', err));
  }, []);

  const isFootballCategory = selectedMenuCategory === 'Sports: Football' || selectedMenuCategory === 'Football';
  const isCricketCategory = selectedMenuCategory === 'Sports: Cricket' || selectedMenuCategory === 'Cricket';

  const context = (activeTab === 'fifa' || activeTab === 'fifaAllScores' || isFootballCategory) ? 'fifa' :
    (activeTab === 'cricket' || isCricketCategory) ? 'live_sports' :
      (activeTab === 'sports') ? 'sports' :
        'news';

  const [activeSidebarTab, setActiveSidebarTab] = useState('Highlights');

  useEffect(() => {
    if (context === 'live_sports') setActiveSidebarTab('Live');
    else if (context === 'fifa') setActiveSidebarTab('Live');
    else setActiveSidebarTab('Highlights');
  }, [context]);

  let tabs: string[] = [];
  if (context === 'live_sports') {
    tabs = ['Live', 'Upcoming'];
  } else if (context === 'fifa') {
    tabs = ['Live', 'Upcoming', 'Results', 'Stats'];
  } else {
    tabs = ['Highlights', 'Trending', 'Others'];
  }

  const filteredForSidebar = React.useMemo(() => {
    const validRelated = (relatedArticles || trendingArticles || []).filter(
      art => !topHeadlineIds.has(art.id) && !failedImages.includes(art.id)
    );
    return validRelated.slice(10);
  }, [relatedArticles, trendingArticles, topHeadlineIds, failedImages]);

  const highlightsArticles = React.useMemo(() => filteredForSidebar.slice(0, 13), [filteredForSidebar]);
  const trendingTabArticles = React.useMemo(() => filteredForSidebar.slice(13, 23), [filteredForSidebar]);
  const othersTabArticles = React.useMemo(() => filteredForSidebar.slice(23, 33), [filteredForSidebar]);

  const hasContent = filteredForSidebar.length > 0;

  const availableTabs = React.useMemo(() => {
    return tabs.filter(t => {
      if (t === 'Highlights') return highlightsArticles.length > 0;
      if (t === 'Trending') return trendingTabArticles.length > 0;
      if (t === 'Others') return othersTabArticles.length > 0;
      return true; // For sports tabs, keep them as they might depend on external APIs (like fixtures)
    });
  }, [tabs, highlightsArticles, trendingTabArticles, othersTabArticles]);

  useEffect(() => {
    // If the active tab becomes hidden, switch to the first available tab
    if (availableTabs.length > 0 && !availableTabs.includes(activeSidebarTab)) {
      setActiveSidebarTab(availableTabs[0]);
    }
  }, [availableTabs, activeSidebarTab]);

  return (
    <aside id="systems-meta-sidebar" className="space-y-6">

      {hasContent && availableTabs.length > 0 && (
        <div className="flex border-b border-portal-border/50 gap-2 mb-4">
          {availableTabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveSidebarTab(t)}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeSidebarTab === t ? 'border-portal-brand text-portal-brand' : 'border-transparent text-portal-text-muted hover:text-portal-text-main hover:border-portal-border'}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-[400px] space-y-6">
        {activeSidebarTab === 'Live' && context === 'live_sports' && (
          <OngoingIccSeriesCard cricketMatches={cricketMatches} />
        )}
        {activeSidebarTab === 'Upcoming' && context === 'live_sports' && (
          <UpcomingFixturesCard />
        )}

        {activeSidebarTab === 'Live' && context === 'fifa' && (
          <FifaLiveMatchesCard />
        )}
        {activeSidebarTab === 'Upcoming' && context === 'fifa' && (
          <FifaUpcomingFixturesCard />
        )}
        {activeSidebarTab === 'Results' && context === 'fifa' && (
          <FifaResultsCard />
        )}
        {activeSidebarTab === 'Stats' && context === 'fifa' && (
          <TopScorersCard />
        )}

        {activeSidebarTab === 'Highlights' && (context === 'news' || context === 'sports') && (
          <>
            {activeTab === 'globalTv' ? (
              <RecentVideosCard />
            ) : (
              <>
                <ThumbnailNewsCard relatedArticles={highlightsArticles} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
              </>
            )}
          </>
        )}
        {activeSidebarTab === 'Trending' && (context === 'news' || context === 'sports') && (
          <>
            {activeTab === 'globalTv' ? (
              <RecentSportVideosCard />
            ) : (
              <TrendingTopicsCard relatedArticles={trendingTabArticles} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
            )}
          </>
        )}
        {activeSidebarTab === 'Others' && (context === 'news' || context === 'sports') && (
          <TrendNewsPanel trendArticles={othersTabArticles} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
        )}

        {activeSidebarTab === 'Saved' && (
          <BookmarkedArticlesCard bookmarks={bookmarks} trendingArticles={trendingArticles} personalizedArticles={personalizedArticles} handleOpenArticle={handleOpenArticle} />
        )}
      </div>

      {/* #7 — Trending Tag Cloud */}
      {context === 'news' && (() => {
        const TAG_COLORS = [
          'border-blue-500/40 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400',
          'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400',
          'border-violet-500/40 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400',
          'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400',
          'border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400',
          'border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-400',
        ];
        const STOP_WORDS = new Set(['the','and','for','with','from','that','this','have','will','been','more','said','than','over','into','after','they','their','about','also','when','were','what','which','news','says','amid']);
        // Extract top keywords from all article titles
        const wordFreq: Record<string, number> = {};
        ;(relatedArticles.length ? relatedArticles : trendingArticles).slice(0, 60).forEach(art => {
          art.title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).forEach(w => {
            if (w.length > 4 && !STOP_WORDS.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
          });
        });
        const tags = Object.entries(wordFreq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 14)
          .map(([word, freq]) => ({ word, freq }));
        if (tags.length < 3) return null;
        const maxFreq = tags[0]?.freq || 1;
        return (
          <div className="border border-portal-border/50 bg-portal-surface p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 bg-gradient-to-b from-portal-brand to-portal-accent" />
              <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-portal-text-muted">Trending Topics</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(({ word, freq }, i) => {
                const sizeRatio = freq / maxFreq;
                const sizeClass = sizeRatio > 0.75 ? 'text-sm font-semibold' : sizeRatio > 0.45 ? 'text-xs font-medium' : 'text-[10px]';
                return (
                  <button
                    key={word}
                    onClick={() => setSearchQuery(word)}
                    className={`px-2.5 py-1 border rounded-full font-mono transition-all duration-200 cursor-pointer ${TAG_COLORS[i % TAG_COLORS.length]} ${sizeClass}`}
                    title={`Search: ${word}`}
                  >
                    #{word}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}


    </aside>
  );
});
