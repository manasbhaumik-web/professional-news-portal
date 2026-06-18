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
}

import MatchResultsPanel from './MatchResultsPanel';
import { SidebarAdvertisement, OngoingIccSeriesCard, BreakingNewsCard, BookmarkedArticlesCard, UpcomingFixturesCard, TopScorersCard, TrendingTopicsCard, ProAdCard } from './SidebarComponents';

export default React.memo(function SystemSidebar({
  bookmarks,
  trendingArticles,
  personalizedArticles,
  relatedArticles,
  handleOpenArticle,
  setActiveTab,
  setSearchQuery,
  activeTab,
  failedImages = []
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

  return (
    <aside id="systems-meta-sidebar" className="space-y-6">

      {/* Top panel: ICC on sports/cricket, Match Results on fifa, Breaking News everywhere else */}
      {(activeTab === 'sports' || activeTab === 'cricket') ? (
        <div className="space-y-6">
          <SidebarAdvertisement />
          <OngoingIccSeriesCard cricketIsMock={cricketIsMock} cricketMatches={cricketMatches} />
        </div>
      ) : (activeTab === 'fifa' || activeTab === 'fifaAllScores') ? (
        <MatchResultsPanel setActiveTab={setActiveTab} key={activeTab} activeTab={activeTab} />
      ) : (
        <>
          <BreakingNewsCard relatedArticles={trendingArticles} handleOpenArticle={handleOpenArticle} />
          {/* Second Advertisement — right under Breaking News */}
          <SidebarAdvertisement />
        </>
      )}

      <BookmarkedArticlesCard bookmarks={bookmarks} trendingArticles={trendingArticles} personalizedArticles={personalizedArticles} handleOpenArticle={handleOpenArticle} />

      {activeTab === 'sports' ? (
        <UpcomingFixturesCard />
      ) : activeTab === 'fifaAllScores' ? (
        <TopScorersCard />
      ) : (
        <TrendingTopicsCard relatedArticles={trendingArticles} handleOpenArticle={handleOpenArticle} failedImages={failedImages} />
      )}

      <ProAdCard />
    </aside>
  );
});
