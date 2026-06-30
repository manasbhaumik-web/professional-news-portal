import React, { useState, useEffect, useCallback } from 'react';
import { BookMarked, Trophy, RefreshCw, Clock } from 'lucide-react';
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
  const [cricketIsMock, setCricketIsMock] = useState(true);

  useEffect(() => {
    fetch('/api/cricket/live')
      .then(res => res.json())
      .then(data => {
        setCricketMatches(data.matches || []);
        setCricketIsMock(data.isMock);
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
          <OngoingIccSeriesCard cricketIsMock={cricketIsMock} cricketMatches={cricketMatches} />
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

      <ProAdCard />
    </aside>
  );
});
