import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Newspaper, AlertCircle, RefreshCw, Flame, Sparkles, ChevronDown, ChevronRight, Trophy, Minus, Plus,
  Map, MapPin, Globe, Sun, Compass, Globe2, Palmtree, Building2, Anchor,
  Vote, ScrollText, LineChart, DollarSign, PieChart, Rocket,
  Activity, CircleDot, Flag, FlagTriangleRight, Swords, Shield, Timer, Bike,
  Film, Music, Tv, Star, Cpu, Microscope, Monitor, ShieldAlert,
  CarFront, Footprints, Castle, Moon, Tent, Waves, Mountain, Target, Globe3
} from 'lucide-react';
import { NewsArticle, UserPreferences } from './types';
import MarketTicker from './components/MarketTicker';
const GlobalPage = React.lazy(() => import('./pages/GlobalPage'));
const LocalPage = React.lazy(() => import('./pages/LocalPage'));
const PoliticsPage = React.lazy(() => import('./pages/PoliticsPage'));
const BusinessPage = React.lazy(() => import('./pages/BusinessPage'));
const SportsPage = React.lazy(() => import('./pages/SportsPage'));
const ReportNewsPage = React.lazy(() => import('./pages/ReportNewsPage'));
const EntertainmentPage = React.lazy(() => import('./pages/EntertainmentPage'));
const ScienceTechPage = React.lazy(() => import('./pages/ScienceTechPage'));
const FifaWorldCupPage = React.lazy(() => import('./pages/FifaWorldCupPage'));
const FifaAllScoresPage = React.lazy(() => import('./pages/FifaAllScoresPage'));
const CricketLivePage = React.lazy(() => import('./pages/CricketLivePage'));


import Header from './components/Header';
import ChannelsNav from './components/ChannelsNav';
import MainAdBanner from './components/MainAdBanner';
import IccCricketBanner from './components/IccCricketBanner';
import FeedConfig from './components/FeedConfig';
import ArticleCard from './components/ArticleCard';
import SkeletonArticleCard from './components/SkeletonArticleCard';
import SystemSidebar from './components/SystemSidebar';
import ArticleReaderModal from './components/ArticleReaderModal';
import solariaGtAd from '../assets/solaria_gt_advert.png';

const FootballIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7l-3 4.5h6z" />
    <path d="M12 7l3-4.5" />
    <path d="M12 7l-3-4.5" />
    <path d="M9 11.5l-4 3" />
    <path d="M15 11.5l4 3" />
    <path d="M9 11.5l3 4.5" />
    <path d="M15 11.5l-3 4.5" />
    <path d="M12 16v4.5" />
  </svg>
);

const TennisIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M6 6c3 3 3 9 0 12" />
    <path d="M18 6c-3 3-3 9 0 12" />
  </svg>
);

const CricketIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3.5l10 10c1 1 1 2.5 0 3.5l-1 1c-1 1-2.5 1-3.5 0L3.5 8c-1-1-1-2.5 0-3.5l1-1c1-1 2.5-1 3.5 0z" />
    <path d="M6 5.5l2 2" />
    <path d="M4 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
  </svg>
);

const getArticleRegion = (source: string): string => {
  const s = source.toLowerCase();
  if (s.includes('bbc') || s.includes('france') || s.includes('ft') || s.includes('sky')) return 'Europe';
  if (s.includes('al jazeera') || s.includes('arab')) return 'Arab';
  if (s.includes('india') || s.includes('times of')) return 'South Asia';
  if (s.includes('cna') || s.includes('strait')) return 'South East Asia';
  if (s.includes('abc') || s.includes('oceania')) return 'Oceania';
  if (s.includes('latin') || s.includes('merco')) return 'Latin America';
  if (s.includes('africa')) return 'Sub-Saharan Africa';
  return 'North America'; // default local region
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'trending' | 'foryou' | 'globalTv' | 'local' | 'politics' | 'business' | 'sports' | 'report' | 'entertainment' | 'scienceTech' | 'fifa' | 'fifaAllScores' | 'fifaHighlight'>('trending');
  const [highlightMatch, setHighlightMatch] = useState<any | null>(null);
  const [highlightMatchList, setHighlightMatchList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<string[]>([]);

  // FIFA World Cup 2026 live scores
  const [fifaScores, setFifaScores] = useState<any[]>([]);
  const [fifaLoading, setFifaLoading] = useState(false);
  const [fifaStatus, setFifaStatus] = useState<'live' | 'demo' | 'idle'>('idle');
  const [fifaLastUpdated, setFifaLastUpdated] = useState<Date | null>(null);

  const fetchFifaScores = useCallback(async () => {
    setFifaLoading(true);
    try {
      const res = await fetch('/api/football/wc2026');
      const data = await res.json();
      if (res.ok && data.matches && data.matches.length > 0) {
        setFifaScores(data.matches);
        setFifaStatus('live');
      } else {
        setFifaStatus('demo');
      }
      setFifaLastUpdated(new Date());
    } catch {
      setFifaStatus('demo');
    } finally {
      setFifaLoading(false);
    }
  }, []);

  // Fetch FIFA scores on tab switch to football or sports
  useEffect(() => {
    if (selectedMenuCategory === 'Sports: Football' || activeTab === 'fifa') {
      fetchFifaScores();
    }
  }, [selectedMenuCategory, activeTab, fetchFifaScores]);

  // Auto-refresh FIFA scores every 5 minutes when on football tab
  useEffect(() => {
    if (selectedMenuCategory !== 'Sports: Football') return;
    const interval = setInterval(fetchFifaScores, 300000);
    return () => clearInterval(interval);
  }, [selectedMenuCategory, fetchFifaScores]);

  // Cricket API data for main app banner
  const [cricketMatches, setCricketMatches] = useState<any[]>([]);
  const [cricketLoading, setCricketLoading] = useState(false);

  const fetchCricketScores = useCallback(async () => {
    setCricketLoading(true);
    try {
      const res = await fetch('/api/cricket/results');
      const data = await res.json();
      if (res.ok && data.matches) {
        setCricketMatches(data.matches.slice(0, 6)); // Top 6 results
      }
    } catch {
      console.error("Failed to fetch cricket scores");
    } finally {
      setCricketLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedMenuCategory === 'Sports: Cricket' || activeTab === 'cricket') {
      fetchCricketScores();
    }
  }, [selectedMenuCategory, activeTab, fetchCricketScores]);

  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);
  const [personalizedBriefing, setPersonalizedBriefing] = useState<string>('');
  const [personalizedArticles, setPersonalizedArticles] = useState<NewsArticle[]>([]);

  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedCategories: ['Global', 'Local', 'Politics'],
    selectedKeywords: ['Photonic', 'Fusion', 'Carbon'],
    readingSpeed: 'normal'
  });

  const [tempKeyword, setTempKeyword] = useState('');

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isExpandingDeepDive, setIsExpandingDeepDive] = useState(false);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);

  const [isCleanMode, setIsCleanMode] = useState(false);
  const [cleanTheme, setCleanTheme] = useState<'midnight' | 'charcoal' | 'sepia'>('midnight');
  const [cleanFontSize, setCleanFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  const [portalTheme, setPortalTheme] = useState<'dark' | 'light' | 'sepia'>('light');

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isAdMinimized, setIsAdMinimized] = useState(false);

  const CATEGORY_PRESETS = [
    'Global', 'Local', 'Politics', 'Business', 'Sports', 'Articles', 'Blogs'
  ];

  const fetchTrendingNews = useCallback(async () => {
    setIsLoadingArticles(true);
    setErrorFeedback(null);
    try {
      const res = await fetch('/api/news/trending');
      if (!res.ok) throw new Error("Failed to load trending stories");
      const data = await res.json();
      setTrendingArticles(data);
    } catch (e: any) {
      setErrorFeedback(e.message || "Failed to establish secure index connection.");
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingNews();
  }, [fetchTrendingNews]);

  const handleGeneratePersonalFeed = useCallback(async () => {
    setIsGeneratingBriefing(true);
    setErrorFeedback(null);
    setActiveTab('foryou');
    try {
      const res = await fetch('/api/news/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCategories: preferences.selectedCategories,
          selectedKeywords: preferences.selectedKeywords
        })
      });

      if (!res.ok) throw new Error("Failed to formulate personalized briefing");
      const data = await res.json();

      setPersonalizedBriefing(data.briefing || '');
      setPersonalizedArticles(data.articles || []);
    } catch (e: any) {
      setErrorFeedback(e.message || "Unable to formulate custom intelligence report. Please try again later.");
    } finally {
      setIsGeneratingBriefing(false);
    }
  }, [preferences.selectedCategories, preferences.selectedKeywords]);

  const handleDeepDiveExpand = useCallback(async (title: string) => {
    setIsExpandingDeepDive(true);
    try {
      const res = await fetch('/api/news/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error("Could not formulate investigation expansion");
      const data = await res.json();
      setExpandedContent(data.content);
    } catch (e: any) {
      console.error(e);
      setExpandedContent("ANALYSIS EXPANSION LIMITS TRIGGERED:\n\nOur dynamic investigative team is currently offline or experiencing heavy loads.");
    } finally {
      setIsExpandingDeepDive(false);
    }
  }, []);

  const handleOpenArticle = useCallback((art: NewsArticle) => {
    setSelectedArticle(art);
    setExpandedContent(null);
  }, []);

  const handleNotificationRead = useCallback((articleId: string) => {
    const found = [...trendingArticles, ...personalizedArticles].find(art => art.id === articleId);
    if (found) {
      handleOpenArticle(found);
    } else {
      const fallback = trendingArticles[0];
      if (fallback) handleOpenArticle(fallback);
    }
  }, [trendingArticles, personalizedArticles, handleOpenArticle]);

  const toggleBookmark = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]);
  }, []);

  const filteredTrending = useMemo(() => {
    let list = trendingArticles;
    if (selectedMenuCategory.startsWith('Region:')) {
      const region = selectedMenuCategory.split(':')[1].trim();
      list = list.filter(art =>
        art.title.toLowerCase().includes(region.toLowerCase()) ||
        art.summary.toLowerCase().includes(region.toLowerCase()) ||
        art.category.toLowerCase().includes(region.toLowerCase())
      );
    } else if (selectedMenuCategory === 'Global') {
      const worldRegions = ['North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa', 'South Asia', 'South East Asia', 'East Asia', 'Oceania', 'Global'];
      list = list.filter(art => worldRegions.includes(art.category));
    } else if (selectedMenuCategory !== 'All') {
      list = list.filter(art => art.category.toLowerCase() === selectedMenuCategory.toLowerCase());
    }
    if (!searchQuery) return list;
    return list.filter(art =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [trendingArticles, selectedMenuCategory, searchQuery]);

  const filteredPersonalized = useMemo(() => {
    let list = personalizedArticles;
    if (selectedMenuCategory.startsWith('Region:')) {
      const region = selectedMenuCategory.split(':')[1].trim();
      list = list.filter(art =>
        art.title.toLowerCase().includes(region.toLowerCase()) ||
        art.summary.toLowerCase().includes(region.toLowerCase())
      );
    } else if (selectedMenuCategory !== 'All') {
      list = list.filter(art => art.category.toLowerCase() === selectedMenuCategory.toLowerCase());
    }
    return list;
  }, [personalizedArticles, selectedMenuCategory]);

  return (
    <div id="news-portal-root" className={`min-h-screen theme-${portalTheme} bg-portal-bg text-portal-text-main font-sans flex flex-col antialiased selection:bg-portal-brand selection:text-white transition-colors duration-300`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        portalTheme={portalTheme}
        setPortalTheme={setPortalTheme}
        selectedCategories={preferences.selectedCategories}
        handleNotificationRead={handleNotificationRead}
      />

      <MarketTicker theme={portalTheme} />

      <ChannelsNav
        selectedMenuCategory={selectedMenuCategory}
        setSelectedMenuCategory={setSelectedMenuCategory}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {errorFeedback && (
        <div id="secure-system-log-bar" className="bg-red-950/40 border-b border-red-900/50 p-2 text-center text-xs text-red-400 flex items-center justify-center gap-2 font-mono">
          <AlertCircle size={14} className="text-red-500 animate-pulse" />
          <span>[SYSTEM NOTICE] {errorFeedback}</span>
          <button onClick={() => setErrorFeedback(null)} className="text-red-300 hover:text-white underline ml-2">Dismiss</button>
        </div>
      )}

      <main id="news-portal-grid" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {activeTab === 'sports' && selectedMenuCategory === 'Sports: Football' ? (
          <section className="mb-2 p-5 sm:p-6 border rounded-xl flex flex-col items-start gap-4 shadow-sm transition-colors bg-portal-surface border-portal-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-portal-brand">
              <Trophy size={160} />
            </div>

            <div className="flex w-full items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-portal-brand font-bold uppercase text-[10px] tracking-widest font-mono">
                <Trophy size={14} /> FIFA World Cup 2026 — Match Results
                {fifaStatus === 'live' && (
                  <span className="ml-2 flex items-center gap-1 text-[9px] text-green-500 font-mono">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live Data
                  </span>
                )}
                {fifaStatus === 'demo' && (
                  <span className="ml-2 text-[9px] text-amber-500 font-mono">⚠ Demo Data</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {fifaLastUpdated && (
                  <span className="text-[9px] font-mono text-portal-text-muted">
                    Updated {fifaLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <button
                  onClick={fetchFifaScores}
                  disabled={fifaLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-portal-bg hover:bg-portal-surface-hover text-portal-text-main border border-portal-border shadow-sm disabled:opacity-50"
                >
                  <RefreshCw size={11} className={fifaLoading ? 'animate-spin' : ''} />
                  {fifaLoading ? 'Fetching...' : 'Refresh'}
                </button>
                <button
                  onClick={() => { setActiveTab('trending'); setSelectedMenuCategory('All'); }}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all bg-portal-bg hover:bg-portal-surface-hover text-portal-text-main border border-portal-border shadow-sm"
                >
                  Exit Stadium
                </button>
              </div>
            </div>

            {fifaLoading && fifaScores.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col bg-portal-bg p-3 rounded-xl border border-portal-border h-28">
                    <div className="flex justify-between items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-portal-surface-hover"></div>
                      <div className="flex-1 h-6 bg-portal-surface-hover rounded"></div>
                      <div className="w-8 h-8 rounded-full bg-portal-surface-hover"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full relative z-10">
                {(fifaScores.length > 0 ? fifaScores : [
                  { team1: 'Japan', flag1: null, crest1: 'https://flagcdn.com/jp.svg', score1: 3, team2: 'Senegal', flag2: null, crest2: 'https://flagcdn.com/sn.svg', score2: 1, status: 'FULL TIME', date: 'JUN 15', goals: [{ minute: 14, scorer: 'Mitoma' }, { minute: 38, scorer: 'Dia' }, { minute: 67, scorer: 'Kubo' }, { minute: 82, scorer: 'Doan' }] },
                  { team1: 'Australia', flag1: null, crest1: 'https://flagcdn.com/au.svg', score1: 2, team2: 'Türkiye', flag2: null, crest2: 'https://flagcdn.com/tr.svg', score2: 0, status: 'FULL TIME', date: 'JUN 14', goals: [{ minute: 31, scorer: 'Duke' }, { minute: 78, scorer: 'Irvine' }] },
                  { team1: 'South Korea', flag1: null, crest1: 'https://flagcdn.com/kr.svg', score1: 2, team2: 'Czechia', flag2: null, crest2: 'https://flagcdn.com/cz.svg', score2: 1, status: 'FULL TIME', date: 'JUN 14', goals: [{ minute: 22, scorer: 'Son' }, { minute: 55, scorer: 'Schick' }, { minute: 73, scorer: 'Hwang' }] },
                  { team1: 'Mexico', flag1: null, crest1: 'https://flagcdn.com/mx.svg', score1: 2, team2: 'S. Africa', flag2: null, crest2: 'https://flagcdn.com/za.svg', score2: 0, status: 'FULL TIME', date: 'JUN 13', goals: [{ minute: 40, scorer: 'Giménez' }, { minute: 89, scorer: 'Martin' }] },
                  { team1: 'USA', flag1: null, crest1: 'https://flagcdn.com/us.svg', score1: 4, team2: 'Paraguay', flag2: null, crest2: 'https://flagcdn.com/py.svg', score2: 1, status: 'FULL TIME', date: 'JUN 12', goals: [{ minute: 10, scorer: 'Pulisic' }, { minute: 28, scorer: 'Balogun' }, { minute: 45, scorer: 'Almirón' }, { minute: 61, scorer: 'Weah' }, { minute: 85, scorer: 'Pepi' }] },
                ]).slice(0, 5).map((game: any, idx: number) => {
                  const img1 = game.flag1 && game.flag1.startsWith('http') ? game.flag1 : (game.crest1 || `https://flagcdn.com/${game.flag1}.svg`);
                  const img2 = game.flag2 && game.flag2.startsWith('http') ? game.flag2 : (game.crest2 || `https://flagcdn.com/${game.flag2}.svg`);
                  const statusLabel = game.status === 'FT' ? 'FULL TIME' : game.status;
                  return (
                    <div key={game.id || idx} className="flex flex-col justify-between bg-portal-bg p-3 rounded-xl border border-portal-border shadow-sm h-full w-full">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="text-center flex flex-col items-center w-14 shrink-0">
                          <img src={img1} alt={game.team1} className="w-8 h-8 object-cover rounded-full border border-portal-border shadow-sm mb-1" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                          <h3 className="font-bold text-portal-text-main text-[10px] text-center w-full truncate">{game.team1}</h3>
                        </div>
                        <div className="flex flex-col items-center flex-1 shrink-0 px-1">
                          <div className="text-2xl font-black font-mono text-portal-text-main tracking-widest flex items-center justify-center drop-shadow-sm whitespace-nowrap">
                            {game.score1} <span className="mx-1.5 text-portal-text-muted/50">-</span> {game.score2}
                          </div>
                          <div className="text-[8px] bg-portal-surface-hover text-portal-text-main border border-portal-border px-1.5 py-0.5 rounded-full font-bold mt-1 whitespace-nowrap">{statusLabel}</div>
                          <div className="text-[8px] text-portal-brand mt-1 font-mono uppercase tracking-widest whitespace-nowrap">{game.date}</div>
                        </div>
                        <div className="text-center flex flex-col items-center w-14 shrink-0">
                          <img src={img2} alt={game.team2} className="w-8 h-8 object-cover rounded-full border border-portal-border shadow-sm mb-1" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
                          <h3 className="font-bold text-portal-text-main text-[10px] text-center w-full truncate">{game.team2}</h3>
                        </div>
                      </div>
                      {/* Scorers */}
                      {game.goals && game.goals.length > 0 && (
                        <div className="mt-2 text-[8px] text-portal-text-muted border-t border-portal-border/40 pt-1 text-center font-mono truncate px-1 w-full">
                          ⚽ {game.goals.map((g: any) => `${g.scorer} (${g.minute}')`).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* View All Scores link */}
            <div className="flex items-center justify-end w-full relative z-10">
              <button
                onClick={() => setActiveTab('fifaAllScores')}
                className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-portal-brand hover:text-portal-accent transition-colors group"
              >
                <Trophy size={11} />
                View All Match Scores
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </section>
        ) : activeTab === 'cricket' || activeTab === 'fifa' || (activeTab === 'sports' && selectedMenuCategory === 'Sports: Cricket') ? (
          <IccCricketBanner
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cricketLoading={cricketLoading}
            cricketMatches={cricketMatches}
          />
        ) : (
          <MainAdBanner isAdMinimized={isAdMinimized} setIsAdMinimized={setIsAdMinimized} trendingArticles={filteredTrending} handleOpenArticle={handleOpenArticle} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">

          <div id="primary-articles-column" className="md:col-span-2 lg:col-span-3 space-y-6">

            <AnimatePresence mode="wait">
              {activeTab === 'foryou' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeedConfig
                    activeTab={activeTab}
                    preferences={preferences}
                    setPreferences={setPreferences}
                    tempKeyword={tempKeyword}
                    setTempKeyword={setTempKeyword}
                    isGeneratingBriefing={isGeneratingBriefing}
                    handleGeneratePersonalFeed={handleGeneratePersonalFeed}
                    CATEGORY_PRESETS={CATEGORY_PRESETS}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div id="feed-results-container" className="space-y-4">

              {(activeTab === 'trending' || activeTab === 'foryou') && (
                <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                        {activeTab === 'trending' ? 'Trending Spotlight Indexes' : 'Personal Intel Briefing'}
                      </h3>
                      {selectedMenuCategory !== 'All' && (
                        <span className="text-[10px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded border bg-portal-brand/10 text-portal-brand border-portal-brand/30">
                          {selectedMenuCategory}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
                      {activeTab === 'trending' ? `${filteredTrending.length} indexes` : 'Curated'}
                    </span>
                  </div>

                  {activeTab === 'trending' ? (
                    <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                      <Flame size={12} className="text-[#ef4444] animate-pulse" />
                      <span>Updated in Real-Time via Telecom Core</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleGeneratePersonalFeed}
                      className="text-xs flex items-center space-x-1 text-portal-text-muted hover:text-portal-accent transition-colors"
                    >
                      <RefreshCw size={12} />
                      <span>Regenerate Brief</span>
                    </button>
                  )}
                </div>
              )}

              {isLoadingArticles && (
                <div className="p-12 text-center text-portal-text-muted text-xs font-mono flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-portal-brand" size={24} />
                  <span>Establishing cryptographic news stream tunnel...</span>
                </div>
              )}

              <div id="articles-list-flow" className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                <AnimatePresence>
                  {activeTab === 'trending' && (
                    filteredTrending.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-20 text-portal-text-muted border border-dashed border-portal-border rounded-xl bg-portal-surface md:col-span-2">
                        <AlertCircle size={40} className="mb-4 opacity-50" />
                        <p className="text-sm font-mono">NO RECORDS FOUND IN INDEX</p>
                      </div>
                    ) : (
                      (() => {
                        const topHeadlineIds = new Set(
                          [...filteredTrending]
                            .filter(art => !!art.imageUrl && !failedImages.includes(art.id))
                            .sort((a, b) => {
                              const tb = new Date(b.publishedAt || b.date).getTime();
                              const ta = new Date(a.publishedAt || a.date).getTime();
                              return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
                            })
                            .slice(0, 3)
                            .map(a => a.id)
                        );
                        
                        const isBannerVisible = activeTab !== 'cricket' && activeTab !== 'fifa' && !(activeTab === 'sports' && (selectedMenuCategory === 'Sports: Football' || selectedMenuCategory === 'Sports: Cricket'));
                        
                        const seenTitles = new Set();
                        const validArticles = [...filteredTrending]
                          .sort((a, b) => {
                            const tb = new Date(b.publishedAt || b.date).getTime();
                            const ta = new Date(a.publishedAt || a.date).getTime();
                            return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
                          })
                          .filter(art => {
                            if (!art.imageUrl || failedImages.includes(art.id)) return false;
                            if (seenTitles.has(art.title)) return false;
                            seenTitles.add(art.title);
                            if (isBannerVisible && topHeadlineIds.has(art.id)) return false;
                            return true;
                          });
                          
                        const mainArticles = validArticles.slice(0, 8);
                        
                        return mainArticles.map((art, idx) => (
                          <ArticleCard
                            key={art.id}
                            index={idx}
                            art={art}
                            handleOpenArticle={handleOpenArticle}
                            toggleBookmark={toggleBookmark}
                            isBookmarked={bookmarks.includes(art.id)}
                            failedImages={failedImages}
                            setFailedImages={setFailedImages}
                          />
                        ));
                      })()
                    )
                  )}

                  {activeTab === 'foryou' && (
                    isGeneratingBriefing ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonArticleCard key={i} index={i} />
                      ))
                    ) : filteredPersonalized.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-20 text-portal-text-muted border border-dashed border-portal-border rounded-xl bg-portal-surface md:col-span-2">
                        <AlertCircle size={40} className="mb-4 opacity-50 text-portal-accent" />
                        <p className="text-sm font-mono text-portal-accent mb-2">INTELLIGENCE BRIEFING EMPTY</p>
                        <p className="text-xs max-w-md text-center opacity-70">
                          We couldn't formulate a brief based on your current tracking parameters. Modify your interests or try generating again.
                        </p>
                      </div>
                    ) : (
                      filteredPersonalized.map((art, idx) => (
                        <ArticleCard
                          key={art.id}
                          index={idx}
                          art={art}
                          handleOpenArticle={handleOpenArticle}
                          toggleBookmark={toggleBookmark}
                          isBookmarked={bookmarks.includes(art.id)}
                          isCustomFeed
                          failedImages={failedImages}
                          setFailedImages={setFailedImages}
                        />
                      ))
                    )
                  )}
                </AnimatePresence>
              </div>

              {activeTab === 'trending' && filteredTrending.length > 0 && (
                (() => {
                  const topHeadlineIds = new Set(
                    [...filteredTrending]
                      .filter(art => !!art.imageUrl && !failedImages.includes(art.id))
                      .sort((a, b) => {
                        const tb = new Date(b.publishedAt || b.date).getTime();
                        const ta = new Date(a.publishedAt || a.date).getTime();
                        return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
                      })
                      .slice(0, 3)
                      .map(a => a.id)
                  );
                  
                  const isBannerVisible = activeTab !== 'cricket' && activeTab !== 'fifa' && !(activeTab === 'sports' && (selectedMenuCategory === 'Sports: Football' || selectedMenuCategory === 'Sports: Cricket'));
                  
                  const seenTitles = new Set();
                  const validArticles = [...filteredTrending]
                    .sort((a, b) => {
                      const tb = new Date(b.publishedAt || b.date).getTime();
                      const ta = new Date(a.publishedAt || a.date).getTime();
                      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
                    })
                    .filter(art => {
                      if (!art.imageUrl || failedImages.includes(art.id)) return false;
                      if (seenTitles.has(art.title)) return false;
                      seenTitles.add(art.title);
                      if (isBannerVisible && topHeadlineIds.has(art.id)) return false;
                      return true;
                    });
                    
                  const overflowArticles = validArticles.slice(8);

                  if (overflowArticles.length === 0) return null;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 mb-4 w-full relative group"
                    >
                      <div className="flex items-center justify-between border-b border-portal-border pb-3 mb-5">
                        <h3 className="text-portal-text-main font-serif font-black text-xl flex items-center gap-2">
                          <Sparkles size={18} className="text-portal-brand" /> More from the Wire
                        </h3>
                        <div className="flex items-center gap-2">
                          <button 
                            className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main rounded-full p-2 transition-colors disabled:opacity-30" 
                            onClick={(e) => { e.currentTarget.parentElement?.parentElement?.nextElementSibling?.scrollBy({ left: -350, behavior: 'smooth' }) }}
                          >
                            <ChevronRight size={18} className="rotate-180" />
                          </button>
                          <button 
                            className="bg-portal-surface border border-portal-border hover:bg-portal-surface-hover text-portal-text-main rounded-full p-2 transition-colors disabled:opacity-30" 
                            onClick={(e) => { e.currentTarget.parentElement?.parentElement?.nextElementSibling?.scrollBy({ left: 350, behavior: 'smooth' }) }}
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 hidden-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                         {overflowArticles.map((art) => (
                           <div key={art.id} className="h-full min-w-[280px] w-[280px] sm:min-w-[340px] sm:w-[340px] snap-center shrink-0">
                             <ArticleCard
                                art={art}
                                handleOpenArticle={handleOpenArticle}
                                toggleBookmark={toggleBookmark}
                                isBookmarked={bookmarks.includes(art.id)}
                                failedImages={failedImages}
                                setFailedImages={setFailedImages}
                                minimal={true}
                             />
                           </div>
                         ))}
                      </div>
                    </motion.div>
                  );
                })()
              )}

              <React.Suspense fallback={<div className="p-10 flex justify-center text-portal-brand animate-pulse font-mono tracking-widest text-xs">LOADING PORTAL...</div>}>
                {activeTab === 'globalTv' && <GlobalPage theme={portalTheme} />}
                {activeTab === 'local' && (
                  <LocalPage
                    theme={portalTheme}
                    articles={trendingArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'politics' && (
                  <PoliticsPage
                    theme={portalTheme}
                    selectedCategoryFromMenu={selectedMenuCategory.startsWith('Politics:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                    articles={trendingArticles.filter(art => {
                      const isCat = ['Politics', 'Global Policy'].includes(art.category) && (!searchQuery || art.title.toLowerCase().includes(searchQuery.toLowerCase()));
                      const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                      return activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion);
                    }).slice(0, 10)}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'business' && (
                  <BusinessPage
                    theme={portalTheme}
                    selectedCategoryFromMenu={selectedMenuCategory.startsWith('Business:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                    articles={trendingArticles.filter(art => {
                      const isCat = ['Business', 'Finance', 'Markets'].includes(art.category) && (!searchQuery || art.title.toLowerCase().includes(searchQuery.toLowerCase()));
                      const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                      return activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion);
                    }).slice(0, 10)}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'entertainment' && (
                  <EntertainmentPage
                    theme={portalTheme}
                    selectedCategoryFromMenu={selectedMenuCategory.startsWith('Entertainment:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                    articles={trendingArticles.filter(art => {
                      const isCat = ['Entertainment', 'Movie', 'Music'].includes(art.category) && (!searchQuery || art.title.toLowerCase().includes(searchQuery.toLowerCase()));
                      const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                      return activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion);
                    }).slice(0, 10)}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'scienceTech' && (
                  <ScienceTechPage
                    theme={portalTheme}
                    selectedCategoryFromMenu={selectedMenuCategory.startsWith('Science & Tech:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                    articles={trendingArticles.filter(art => ['Science', 'Technology', 'Science & Tech', 'Computing', 'Space', 'Cybersecurity'].includes(art.category) && (!searchQuery || art.title.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 10)}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'report' && <ReportNewsPage />}
                {activeTab === 'sports' && (
                  <SportsPage
                    theme={portalTheme}
                    articles={trendingArticles.filter(art => art.category === 'Sports' && (!searchQuery || art.title.toLowerCase().includes(searchQuery.toLowerCase()))).slice(0, 10)}
                    selectedSportFromMenu={selectedMenuCategory.startsWith('Sports:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages}
                    setFailedImages={setFailedImages}
                  />
                )}
                {activeTab === 'fifa' && <FifaWorldCupPage />}
                {activeTab === 'fifaAllScores' && (
                  <FifaAllScoresPage
                    onBack={() => setActiveTab('fifa')}
                  />
                )}
                {activeTab === 'cricket' && <CricketLivePage />}
              </React.Suspense>

            </div>
          </div>

          <SystemSidebar
            activeTab={activeTab}
            bookmarks={bookmarks}
            trendingArticles={trendingArticles}
            personalizedArticles={personalizedArticles}
            relatedArticles={filteredTrending}
            handleOpenArticle={handleOpenArticle}
            setActiveTab={setActiveTab}
            setSearchQuery={setSearchQuery}
            failedImages={failedImages}
          />
        </div>
      </main>

      {selectedArticle && (
        <ArticleReaderModal
          selectedArticle={selectedArticle}
          setSelectedArticle={setSelectedArticle}
          isCleanMode={isCleanMode}
          setIsCleanMode={setIsCleanMode}
          cleanTheme={cleanTheme}
          setCleanTheme={setCleanTheme}
          cleanFontSize={cleanFontSize}
          setCleanFontSize={setCleanFontSize}
          handleDeepDiveExpand={handleDeepDiveExpand}
          isExpandingDeepDive={isExpandingDeepDive}
          expandedContent={expandedContent}
          toggleBookmark={toggleBookmark}
          bookmarks={bookmarks}
        />
      )}

      <footer id="system-corporate-footer" className="mt-auto bg-portal-surface border-t border-portal-border px-4 sm:px-8 flex flex-col items-center justify-between gap-2 shrink-0 py-4 select-none">
        <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
          <div className="flex space-x-4 text-[10px] text-portal-text-muted uppercase tracking-widest font-semibold">
            <a href="#" className="hover:text-portal-text-main">Operational Index</a>
            <span>•</span>
            <a href="#" className="hover:text-portal-text-main">Encryptions</a>
            <span>•</span>
            <a href="#" className="hover:text-portal-text-main">Terminal protocols</a>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-portal-text-muted font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Sovereign Ledger Online</span>
            <span className="ml-4">© 2026 THE HORIZON POST INC</span>
          </div>
        </div>
        <div className="w-full text-center mt-2 text-[8px] text-portal-text-muted/60 max-w-4xl mx-auto">
          Disclaimer: All product and company names, including FIFA, ICC, and others, are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
        </div>
      </footer>
    </div>
  );
}
