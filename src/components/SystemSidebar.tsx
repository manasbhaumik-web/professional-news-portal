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
  googleArticles?: NewsArticle[];
  selectedMenuCategory?: string;
}

import MatchResultsPanel from './MatchResultsPanel';
import { SidebarAdvertisement, OngoingIccSeriesCard, BookmarkedArticlesCard, UpcomingFixturesCard, TopScorersCard, ThumbnailNewsCard, TrendingTopicsCard, ProAdCard, GoogleNewsPanel, RecentVideosCard, RecentSportVideosCard } from './SidebarComponents';

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
  googleArticles = [],
  selectedMenuCategory
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
  
  const context = (activeTab === 'fifa' || activeTab === 'fifaAllScores' || isFootballCategory) ? 'fifa' :
                  (activeTab === 'sports' || activeTab === 'cricket') ? 'sports' :
                  'news';

  const [activeSidebarTab, setActiveSidebarTab] = useState('Highlights');

  useEffect(() => {
    if (context === 'sports') setActiveSidebarTab('Live');
    else if (context === 'fifa') setActiveSidebarTab('Live');
    else setActiveSidebarTab('Highlights');
  }, [context]);

  let tabs: string[] = [];
  if (context === 'sports') tabs = ['Live', 'Upcoming', 'Saved'];
  else if (context === 'fifa') tabs = ['Live', 'Upcoming', 'Results', 'Stats'];
  else tabs = ['Highlights', 'Trending', 'Saved'];

  const filteredForSidebar = React.useMemo(() => {
    if (activeTab === 'trending') {
      return trendingArticles.slice(25);
    } else if (activeTab === 'business') {
      return trendingArticles.filter(a => !['Business', 'Finance', 'Markets'].includes(a.category));
    } else if (activeTab === 'politics') {
      return trendingArticles.filter(a => !['Politics', 'Global Policy'].includes(a.category));
    } else if (activeTab === 'sports' || activeTab === 'cricket') {
      return trendingArticles.filter(a => !['Sports', 'Athletics'].includes(a.category));
    } else if (activeTab === 'scienceTech') {
      return trendingArticles.filter(a => !['Technology', 'Science', 'Innovation', 'Tech', 'Space'].includes(a.category));
    } else if (activeTab === 'entertainment') {
      return trendingArticles.filter(a => !['Entertainment', 'Culture', 'Arts', 'Lifestyle'].includes(a.category));
    } else {
      return trendingArticles.slice(15);
    }
  }, [trendingArticles, activeTab]);

  return (
    <aside id="systems-meta-sidebar" className="space-y-6">

      <div className="flex border-b border-portal-border/50 gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveSidebarTab(t)}
            className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeSidebarTab === t ? 'border-portal-brand text-portal-brand' : 'border-transparent text-portal-text-muted hover:text-portal-text-main hover:border-portal-border'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] space-y-6">
        {activeSidebarTab === 'Live' && context === 'sports' && (
          <OngoingIccSeriesCard cricketIsMock={cricketIsMock} cricketMatches={cricketMatches} />
        )}
        {activeSidebarTab === 'Upcoming' && context === 'sports' && (
          <UpcomingFixturesCard />
        )}

        {activeSidebarTab === 'Live' && context === 'fifa' && (
          <MatchResultsPanel setActiveTab={setActiveTab} activeTab={activeTab} type="live" />
        )}
        {activeSidebarTab === 'Upcoming' && context === 'fifa' && (
          <MatchResultsPanel setActiveTab={setActiveTab} activeTab={activeTab} type="upcoming" />
        )}
        {activeSidebarTab === 'Results' && context === 'fifa' && (
          <MatchResultsPanel setActiveTab={setActiveTab} activeTab={activeTab} type="results" />
        )}
        {activeSidebarTab === 'Stats' && context === 'fifa' && (
          <TopScorersCard />
        )}

        {activeSidebarTab === 'Highlights' && context === 'news' && (
          <>
            {activeTab === 'globalTv' ? (
              <RecentVideosCard />
            ) : (
              <>
                <ThumbnailNewsCard relatedArticles={filteredForSidebar} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
                <GoogleNewsPanel googleArticles={googleArticles} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
              </>
            )}
          </>
        )}
        {activeSidebarTab === 'Trending' && context === 'news' && (
          <>
            {activeTab === 'globalTv' ? (
              <RecentSportVideosCard />
            ) : (
              <TrendingTopicsCard relatedArticles={filteredForSidebar} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
            )}
          </>
        )}

        {activeSidebarTab === 'Saved' && (
          <BookmarkedArticlesCard bookmarks={bookmarks} trendingArticles={trendingArticles} personalizedArticles={personalizedArticles} handleOpenArticle={handleOpenArticle} />
        )}
      </div>

      <ProAdCard />
    </aside>
  );
});
