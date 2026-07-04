import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    Newspaper, AlertCircle, RefreshCw, Flame, Sparkles, ChevronDown, ChevronRight, Trophy, Minus, Plus, X,
    Map, MapPin, Globe, Sun, Compass, Globe2, Palmtree, Building2, Anchor,
    Vote, ScrollText, LineChart, DollarSign, PieChart, Rocket,
    Activity, CircleDot, Flag, FlagTriangleRight, Swords, Shield, Timer, Bike,
    Film, Music, Tv, Star, Cpu, Microscope, Monitor, ShieldAlert,
    CarFront, Footprints, Castle, Moon, Tent, Waves, Mountain, Target
} from 'lucide-react';
import { NewsArticle, UserPreferences, UserBehaviorProfile } from './types';
import { sortArticlesByDate } from './utils/sortArticles';
import { mixArticlesByCategories } from './utils/mixCategories';
import MarketTicker from './components/MarketTicker';
const GlobalPage = React.lazy(() => import('./pages/GlobalPage'));
const LocalPage = React.lazy(() => import('./pages/LocalPage'));
const PoliticsPage = React.lazy(() => import('./pages/PoliticsPage'));
const BusinessPage = React.lazy(() => import('./pages/BusinessPage'));
const SportsPage = React.lazy(() => import('./pages/SportsPage'));
const ReportNewsPage = React.lazy(() => import('./pages/ReportNewsPage'));
const EntertainmentPage = React.lazy(() => import('./pages/EntertainmentPage'));
const ScienceTechPage = React.lazy(() => import('./pages/ScienceTechPage'));
const CountryPage = React.lazy(() => import('./pages/CountryPage'));
const CricketLivePage = React.lazy(() => import('./pages/CricketLivePage'));


import Header from './components/Header';
import ChannelsNav from './components/ChannelsNav';
import MainAdBanner from './components/MainAdBanner';
import { BreakingNewsTicker } from './components/SidebarComponents';
import MoreFromWire from './components/MoreFromWire';
import GoogleNewsSection from './components/GoogleNewsSection';

import IccCricketBanner from './components/IccCricketBanner';
import FeedConfig from './components/FeedConfig';
import { Helmet } from 'react-helmet-async';
import ArticleCard from './components/ArticleCard';
import SkeletonArticleCard from './components/SkeletonArticleCard';
import InfiniteScroll from './components/InfiniteScroll';
import SystemSidebar from './components/SystemSidebar';
import SearchBar from './components/SearchBar';
import ArticleReaderModal from './components/ArticleReaderModal';
import solariaGtAd from '../assets/solaria_gt_advert.png';
import TopNewsSection from './components/TopNewsSection';
import AdminLoginModal from './components/AdminLoginModal';
import CmsPage from './pages/CmsPage';
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
    const [activeTab, setActiveTab] = useState<string>('trending');
    const [highlightMatch, setHighlightMatch] = useState<any | null>(null);
    const [highlightMatchList, setHighlightMatchList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('all');
    const [sortOption, setSortOption] = useState('latest');
    const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('All');
    const [failedImages, setFailedImages] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("United States");

    // Infinite scroll limits
    const [trendingLimit, setTrendingLimit] = useState(10);
    const [foryouLimit, setForyouLimit] = useState(10);

    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');

    useEffect(() => {
        let lastScrollY = window.pageYOffset;

        const updateScrollDirection = () => {
            const scrollY = window.pageYOffset;
            const direction = scrollY > lastScrollY ? 'down' : 'up';
            if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
                setScrollDirection(direction);
            }
            lastScrollY = scrollY > 0 ? scrollY : 0;
        };
        window.addEventListener('scroll', updateScrollDirection);
        return () => window.removeEventListener('scroll', updateScrollDirection);
    }, [scrollDirection]);

    // CMS States
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setShowAdminLogin(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);



    // FIFA World Cup 2026 news feeds for Main Ad Banner
    const [fifaNewsArticles, setFifaNewsArticles] = useState<NewsArticle[]>([]);

    const FIFA_NEWS_FEEDS = useMemo(() => [
        { name: 'BBC Sport - Football', flag: '🇬🇧', url: '/api/news/proxy?url=' + encodeURIComponent('http://feeds.bbci.co.uk/sport/football/rss.xml') },
        { name: 'ESPN FC', flag: '🇺🇸', url: '/api/news/proxy?url=' + encodeURIComponent('https://www.espn.com/espn/rss/soccer/news') },
        { name: 'Goal.com', flag: '⚽', url: '/api/news/proxy?url=' + encodeURIComponent('https://www.goal.com/feeds/en/news') },
        { name: 'Reuters Sports', flag: '🌍', url: '/api/news/proxy?url=' + encodeURIComponent('https://feeds.reuters.com/reuters/sportsNews') },
        { name: 'Sky Sports Football', flag: '🇬🇧', url: '/api/news/proxy?url=' + encodeURIComponent('https://www.skysports.com/rss/12040') },
    ], []);

    const FIFA_FALLBACK_ARTICLES: NewsArticle[] = useMemo(() => [
        { id: 'fifa-hl-1', title: 'FIFA World Cup 2026: Everything You Need To Know', category: 'Sports', summary: 'The 2026 FIFA World Cup will be hosted jointly by the United States, Canada, and Mexico — the first World Cup with three host nations. 48 teams will compete for the title.', content: '', source: 'FIFA Official', date: 'Today', readTime: '3 min read', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', views: 5200, publishedAt: new Date().toISOString(), sportName: 'Football' },
        { id: 'fifa-hl-2', title: 'USA, Canada & Mexico Prepare for Historic Joint World Cup 2026', category: 'Sports', summary: 'North America gears up for the largest World Cup in history, with 48 nations competing across 16 host cities in three countries for the first time ever.', content: '', source: 'ESPN', date: 'Today', readTime: '4 min read', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80', views: 4100, publishedAt: new Date(Date.now() - 3600000).toISOString(), sportName: 'Football' },
        { id: 'fifa-hl-3', title: 'World Cup 2026 Group Stage: Shocking Results and Top Performers', category: 'Sports', summary: 'The group stage has produced upsets, drama and outstanding individual performances. Here are the key takeaways from the opening rounds.', content: '', source: 'BBC Sport', date: 'Today', readTime: '5 min read', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', views: 3800, publishedAt: new Date(Date.now() - 7200000).toISOString(), sportName: 'Football' },
        { id: 'fifa-hl-4', title: 'Top Scorers & Stats at FIFA World Cup 2026', category: 'Sports', summary: "Who's leading the Golden Boot race? We break down the top scorers, assists, and key statistics from the group stages.", content: '', source: 'Goal.com', date: 'Today', readTime: '3 min read', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', views: 3200, publishedAt: new Date(Date.now() - 10800000).toISOString(), sportName: 'Football' },
        { id: 'fifa-hl-5', title: 'World Cup 2026: Bracket, Schedule & All Results', category: 'Sports', summary: 'Complete FIFA World Cup 2026 bracket, schedule, and live results — from the group stage through to the final in MetLife Stadium.', content: '', source: 'Sky Sports', date: 'Today', readTime: '4 min read', imageUrl: 'https://images.unsplash.com/photo-1555952497-c1285f3a0f2b?w=800&q=80', views: 2900, publishedAt: new Date(Date.now() - 14400000).toISOString(), sportName: 'Football' },
    ], []);

    const fetchFifaNews = useCallback(async () => {
        const fifaKeywords = ['world cup', 'fifa', '2026', 'soccer', 'football championship', 'group stage', 'knockout', 'goal', 'match', 'squad'];
        const allArticles: NewsArticle[] = [];

        await Promise.allSettled(
            FIFA_NEWS_FEEDS.map(async (feed) => {
                try {
                    const res = await fetch(feed.url);
                    const data = await res.json();
                    if (data.status === 'ok' && data.items) {
                        const filtered = data.items.filter((item: any) => {
                            const text = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
                            return fifaKeywords.some(kw => text.includes(kw));
                        });
                        const items = filtered.length > 0 ? filtered : data.items.slice(0, 3);
                        items.slice(0, 5).forEach((item: any, idx: number) => {
                            allArticles.push({
                                id: `fifa-feed-${feed.name}-${idx}-${Date.now()}`,
                                title: item.title || 'No Title',
                                category: 'Sports',
                                summary: (item.description || item.content || '').replace(/<[^>]+>/g, '').substring(0, 200),
                                content: item.content || item.description || '',
                                source: feed.name,
                                date: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today',
                                readTime: '3 min read',
                                imageUrl: item.enclosure?.link || item.thumbnail || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
                                views: Math.floor(Math.random() * 3000) + 500,
                                publishedAt: item.pubDate || new Date().toISOString(),
                                originalUrl: item.link || '#',
                                sportName: 'Football',
                            });
                        });
                    }
                } catch { /* silent fail for individual feeds */ }
            })
        );

        if (allArticles.length > 0) {
            setFifaNewsArticles(sortArticlesByDate(allArticles));
        } else {
            setFifaNewsArticles(sortArticlesByDate(FIFA_FALLBACK_ARTICLES));
        }
    }, [FIFA_NEWS_FEEDS, FIFA_FALLBACK_ARTICLES]);

    useEffect(() => {
        if (activeTab === 'fifa' && fifaNewsArticles.length === 0) {
            fetchFifaNews();
        }
    }, [activeTab, fifaNewsArticles.length, fetchFifaNews]);

    // Cricket API data for main app banner
    const [cricketMatches, setCricketMatches] = useState<any[]>([]);
    const [cricketLoading, setCricketLoading] = useState(false);

    const fetchCricketScores = useCallback(async () => {
        setCricketLoading(true);
        try {
            const res = await fetch('/api/cricket/live');
            const data = await res.json();
            if (res.ok && data.matches) {
                setCricketMatches(data.matches.slice(0, 6)); // Top 6 matches
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
    const [categoryArticles, setCategoryArticles] = useState<NewsArticle[] | null>(null);
    const [personalizedBriefing, setPersonalizedBriefing] = useState<string>('');
    const [personalizedArticles, setPersonalizedArticles] = useState<NewsArticle[]>([]);

    const [liveNews, setLiveNews] = useState<NewsArticle | null>(null);
    const [showLiveToast, setShowLiveToast] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource('/api/news/live-stream');
        eventSource.onmessage = (event) => {
            try {
                const article: NewsArticle = JSON.parse(event.data);
                setLiveNews(article);
                setShowLiveToast(true);
            } catch (e) {
                console.error('Failed to parse SSE data', e);
            }
        };
        return () => {
            eventSource.close();
        };
    }, []);

    const handleInjectLiveNews = useCallback(() => {
        if (liveNews) {
            setTrendingArticles(prev => [liveNews, ...prev]);
            setShowLiveToast(false);
            setLiveNews(null);
        }
    }, [liveNews]);

    const [isLoadingArticles, setIsLoadingArticles] = useState(false);
    const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
    const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

    const [preferences, setPreferences] = useState<UserPreferences>({
        selectedCategories: ['Global', 'Local', 'Politics'],
        selectedKeywords: ['Photonic', 'Fusion', 'Carbon'],
        readingSpeed: 'normal'
    });

    const [tempKeyword, setTempKeyword] = useState('');

    const [behaviorProfile, setBehaviorProfile] = useState<UserBehaviorProfile>(() => {
        const stored = localStorage.getItem('userBehaviorProfile');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch { }
        }
        return { categories: {}, keywords: {}, lastUpdated: new Date().toISOString() };
    });

    const resetBehaviorProfile = useCallback(() => {
        const reset = { categories: {}, keywords: {}, lastUpdated: new Date().toISOString() };
        setBehaviorProfile(reset);
        localStorage.setItem('userBehaviorProfile', JSON.stringify(reset));
    }, []);

    const updateBehaviorProfile = useCallback((article: NewsArticle, weight: number = 1) => {
        setBehaviorProfile(prev => {
            const next = {
                ...prev,
                categories: { ...prev.categories },
                keywords: { ...prev.keywords },
                lastUpdated: new Date().toISOString()
            };
            if (article.category) {
                next.categories[article.category] = (next.categories[article.category] || 0) + weight;
            }
            const words = article.title.toLowerCase().split(/[\s,.-]+/).filter(w => w.length > 4);
            words.slice(0, 5).forEach(w => {
                next.keywords[w] = (next.keywords[w] || 0) + (weight * 0.5);
            });
            localStorage.setItem('userBehaviorProfile', JSON.stringify(next));
            return next;
        });
    }, []);

    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [isExpandingDeepDive, setIsExpandingDeepDive] = useState(false);
    const [expandedContent, setExpandedContent] = useState<string | null>(null);

    const [isCleanMode, setIsCleanMode] = useState(false);
    const [cleanTheme, setCleanTheme] = useState<'midnight' | 'charcoal' | 'sepia'>('midnight');
    const [cleanFontSize, setCleanFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

    const [portalTheme, setPortalTheme] = useState<'dark' | 'light' | 'sepia'>('light');
    const [siteConfig, setSiteConfig] = useState<any>({
        siteTitle: 'The Horizon Post Online',
        footerText: '© 2026 THE HORIZON POST INC',
        defaultTheme: 'dark'
    });

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                setSiteConfig(data);
                if (data.defaultTheme) {
                    setPortalTheme(data.defaultTheme);
                }
            })
            .catch(err => console.error(err));
    }, []);

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
            setTrendingArticles(mixArticlesByCategories(data));
        } catch (e: any) {
            setErrorFeedback(e.message || "Failed to establish secure index connection.");
        } finally {
            setIsLoadingArticles(false);
        }
    }, []);

    const fetchTopicNews = useCallback(async (topic: string) => {
        setIsLoadingArticles(true);
        setErrorFeedback(null);
        try {
            const res = await fetch(`/api/news/topic?q=${encodeURIComponent(topic)}`);
            if (!res.ok) throw new Error("Failed to load topic stories");
            const data = await res.json();
            setCategoryArticles(sortArticlesByDate(data));
        } catch (e: any) {
            setErrorFeedback(e.message || "Failed to establish secure index connection.");
            setCategoryArticles(null);
        } finally {
            setIsLoadingArticles(false);
        }
    }, []);

    useEffect(() => {
        fetchTrendingNews();
    }, [fetchTrendingNews]);

    useEffect(() => {
        if (selectedMenuCategory === 'All' || selectedMenuCategory === 'Global' || selectedMenuCategory.startsWith('Region:')) {
            setCategoryArticles(null);
        } else {
            let query = selectedMenuCategory;
            // Temporarily clear old category articles to avoid flash of old content
            setCategoryArticles(null);
            fetchTopicNews(query);
        }
    }, [selectedMenuCategory, fetchTopicNews]);

    const handleGeneratePersonalFeed = useCallback(async () => {
        setIsGeneratingBriefing(true);
        setErrorFeedback(null);
        setActiveTab('foryou');
        try {
            // Merge implicit and explicit preferences
            const topImplicitCats = Object.entries(behaviorProfile.categories)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(e => e[0]);

            const topImplicitKeywords = Object.entries(behaviorProfile.keywords)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(e => e[0]);

            const mergedCategories = Array.from(new Set([...preferences.selectedCategories, ...topImplicitCats]));
            const mergedKeywords = Array.from(new Set([...preferences.selectedKeywords, ...topImplicitKeywords]));

            const res = await fetch('/api/news/personalized', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedCategories: mergedCategories,
                    selectedKeywords: mergedKeywords
                })
            });

            if (!res.ok) throw new Error("Failed to formulate personalized briefing");
            const data = await res.json();

            setPersonalizedBriefing(data.briefing || '');
            setPersonalizedArticles(sortArticlesByDate(data.articles || []));
        } catch (e: any) {
            setErrorFeedback(e.message || "Unable to formulate custom intelligence report. Please try again later.");
        } finally {
            setIsGeneratingBriefing(false);
        }
    }, [preferences.selectedCategories, preferences.selectedKeywords, behaviorProfile]);

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
        updateBehaviorProfile(art, 1);
    }, [updateBehaviorProfile]);

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
        setBookmarks(prev => {
            const isAdding = !prev.includes(id);
            if (isAdding) {
                const art = [...trendingArticles, ...personalizedArticles, ...(categoryArticles || [])].find(a => a.id === id);
                if (art) updateBehaviorProfile(art, 2);
            }
            return isAdding ? [...prev, id] : prev.filter(bId => bId !== id);
        });
    }, [trendingArticles, personalizedArticles, categoryArticles, updateBehaviorProfile]);

    const filteredTrending = useMemo(() => {
        let list = categoryArticles || trendingArticles;

        if (!categoryArticles) {
            if (selectedMenuCategory.startsWith('Region:')) {
                const region = selectedMenuCategory.split(':')[1].trim();
                list = list.filter(art => {
                    const mappedRegion = getArticleRegion(art.source || '');
                    return mappedRegion.toLowerCase() === region.toLowerCase() ||
                        (art.title && art.title.toLowerCase().includes(region.toLowerCase())) ||
                        (art.summary && art.summary.toLowerCase().includes(region.toLowerCase())) ||
                        (art.category && art.category.toLowerCase().includes(region.toLowerCase()));
                });
            } else if (selectedMenuCategory === 'Global') {
                const worldRegions = ['North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa', 'South Asia', 'South East Asia', 'East Asia', 'Oceania', 'Global'];
                list = list.filter(art => worldRegions.includes(art.category));
            } else if (selectedMenuCategory !== 'All') {
                list = list.filter(art => art.category.toLowerCase() === selectedMenuCategory.toLowerCase());
            }
        }

        let result = [...list];

        // 1. Fuzzy Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(art =>
                (art.title && art.title.toLowerCase().includes(lowerQ)) ||
                (art.summary && art.summary.toLowerCase().includes(lowerQ)) ||
                (art.category && art.category.toLowerCase().includes(lowerQ)) ||
                (art.source && art.source.toLowerCase().includes(lowerQ))
            );
        }

        // 2. Date Filter
        if (filterDate !== 'all') {
            const now = new Date().getTime();
            result = result.filter(art => {
                const artTime = new Date(art.publishedAt || art.date).getTime();
                if (isNaN(artTime)) return true;
                const diffHours = (now - artTime) / (1000 * 60 * 60);
                if (filterDate === '24h') return diffHours <= 24;
                if (filterDate === 'week') return diffHours <= 24 * 7;
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortOption === 'importance') {
                return (b.importance_score || 0) - (a.importance_score || 0);
            } else if (sortOption === 'category') {
                return (a.category || '').localeCompare(b.category || '');
            } else {
                const timeA = new Date(a.publishedAt || a.date).getTime();
                const timeB = new Date(b.publishedAt || b.date).getTime();
                return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
            }
        });

        return result;
    }, [trendingArticles, categoryArticles, selectedMenuCategory, searchQuery, filterDate, sortOption]);

    const filteredPersonalized = useMemo(() => {
        let list = personalizedArticles;
        if (selectedMenuCategory.startsWith('Region:')) {
            const region = selectedMenuCategory.split(':')[1].trim();
            list = list.filter(art => {
                const mappedRegion = getArticleRegion(art.source || '');
                return mappedRegion.toLowerCase() === region.toLowerCase() ||
                    (art.title && art.title.toLowerCase().includes(region.toLowerCase())) ||
                    (art.summary && art.summary.toLowerCase().includes(region.toLowerCase()));
            });
        } else if (selectedMenuCategory !== 'All') {
            list = list.filter(art => art.category.toLowerCase() === selectedMenuCategory.toLowerCase());
        }

        let result = [...list];

        // 1. Fuzzy Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(art =>
                (art.title && art.title.toLowerCase().includes(lowerQ)) ||
                (art.summary && art.summary.toLowerCase().includes(lowerQ)) ||
                (art.category && art.category.toLowerCase().includes(lowerQ)) ||
                (art.source && art.source.toLowerCase().includes(lowerQ))
            );
        }

        // 2. Date Filter
        if (filterDate !== 'all') {
            const now = new Date().getTime();
            result = result.filter(art => {
                const artTime = new Date(art.publishedAt || art.date).getTime();
                if (isNaN(artTime)) return true;
                const diffHours = (now - artTime) / (1000 * 60 * 60);
                if (filterDate === '24h') return diffHours <= 24;
                if (filterDate === 'week') return diffHours <= 24 * 7;
                return true;
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortOption === 'importance') {
                return (b.importance_score || 0) - (a.importance_score || 0);
            } else if (sortOption === 'category') {
                return (a.category || '').localeCompare(b.category || '');
            } else {
                const timeA = new Date(a.publishedAt || a.date).getTime();
                const timeB = new Date(b.publishedAt || b.date).getTime();
                return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
            }
        });

        return result;
    }, [personalizedArticles, selectedMenuCategory, searchQuery, filterDate, sortOption]);

    const topHeadlines = useMemo(() => {
        let catArticles = categoryArticles && categoryArticles.length > 0 ? categoryArticles : filteredTrending;
        if (!categoryArticles || categoryArticles.length === 0) {
            if (activeTab === 'business') catArticles = filteredTrending.filter(a => ['Business', 'Finance', 'Markets'].includes(a.category));
            if (activeTab === 'politics') catArticles = filteredTrending.filter(a => ['Politics', 'Global Policy'].includes(a.category));
            if (activeTab === 'sports') catArticles = filteredTrending.filter(a => ['Sports', 'Athletics'].includes(a.category));
            if (activeTab === 'scienceTech') catArticles = filteredTrending.filter(a => ['Technology', 'Science', 'Innovation', 'Tech'].includes(a.category));
            if (activeTab === 'entertainment') catArticles = filteredTrending.filter(a => ['Entertainment', 'Culture', 'Arts', 'Lifestyle'].includes(a.category));
            if (activeTab === 'fifa') {
                catArticles = fifaNewsArticles.length > 0 ? fifaNewsArticles : FIFA_FALLBACK_ARTICLES;
            }
        }
        const finalBanner = catArticles.length > 2 ? catArticles : filteredTrending;

        const seenTitles = new Set<string>();
        return [...finalBanner]
            .filter(art => {
                if (!art.imageUrl || failedImages.includes(art.id)) return false;
                const normTitle = (art.title || '').trim().toLowerCase();
                if (seenTitles.has(normTitle)) return false;
                seenTitles.add(normTitle);
                return true;
            })
            .sort((a, b) => {
                const tb = new Date(b.publishedAt || b.date).getTime();
                const ta = new Date(a.publishedAt || a.date).getTime();
                return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
            })
            .slice(0, 3);
    }, [categoryArticles, filteredTrending, activeTab, failedImages, fifaNewsArticles]);

    const topHeadlineIds = useMemo(() => new Set(topHeadlines.map(a => a.id)), [topHeadlines]);

    const availableRegions = useMemo(() => {
        const regions = new Set<string>();
        trendingArticles.forEach(art => {
            regions.add(getArticleRegion(art.source));
        });
        return Array.from(regions);
    }, [trendingArticles]);

    return (
        <div id="news-portal-root" className={`min-h-screen theme-${portalTheme} bg-portal-bg text-portal-text-main font-sans flex flex-col antialiased selection:bg-portal-brand selection:text-white transition-colors duration-300`}>
            <Helmet>
                <title>{`${activeTab === 'foryou' ? 'For You' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} News | Horizon Portal`}</title>
                <meta name="description" content="Stay updated with the latest professional news across global, local, politics, and business channels." />
            </Helmet>
            <AnimatePresence>
                {showLiveToast && liveNews && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-4 py-3 rounded-md shadow-2xl flex items-center gap-3 cursor-pointer border border-red-500"
                        onClick={handleInjectLiveNews}
                    >
                        <Flame className="animate-pulse" size={20} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">Live Alert</span>
                            <span className="text-sm font-semibold truncate max-w-sm">{liveNews.title}</span>
                        </div>
                        <button
                            className="ml-4 p-1 text-red-300 hover:text-white rounded-full hover:bg-red-700 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setShowLiveToast(false); }}
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {showAdminLogin && (
                <AdminLoginModal
                    onClose={() => setShowAdminLogin(false)}
                    onSuccess={(token) => {
                        setAdminToken(token);
                        localStorage.setItem('adminToken', token);
                        setShowAdminLogin(false);
                        setActiveTab('cms');
                    }}
                />
            )}
            <div className="sticky top-0 z-50 flex flex-col w-full">
                <div className="relative z-10 flex flex-col w-full shadow-md drop-shadow-md bg-portal-bg">
                    <Header
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        portalTheme={portalTheme}
                        setPortalTheme={setPortalTheme}
                        selectedCategories={preferences.selectedCategories}
                        handleNotificationRead={handleNotificationRead}
                        siteTitle={siteConfig.siteTitle}
                    />

                    {activeTab !== 'cms' && (
                        <>
                            <MarketTicker theme={portalTheme} />

                            <ChannelsNav
                                selectedMenuCategory={selectedMenuCategory}
                                setSelectedMenuCategory={setSelectedMenuCategory}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                availableRegions={availableRegions}
                            />
                        </>
                    )}
                </div>

                {activeTab !== 'cms' && (
                    <div className="relative z-0">
                        <BreakingNewsTicker relatedArticles={trendingArticles} handleOpenArticle={handleOpenArticle} />
                    </div>
                )}
            </div>

            {errorFeedback && (
                <div id="secure-system-log-bar" className="bg-red-950/40 border-b border-red-900/50 p-2 text-center text-xs text-red-400 flex items-center justify-center gap-2 font-mono">
                    <AlertCircle size={14} className="text-red-500 animate-pulse" />
                    <span>[SYSTEM NOTICE] {errorFeedback}</span>
                    <button onClick={() => setErrorFeedback(null)} className="text-red-300 hover:text-white underline ml-2">Dismiss</button>
                </div>
            )}

            <main id="news-portal-grid" className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

                {activeTab === 'sports' && selectedMenuCategory === 'Sports: Cricket' ? (
                    <IccCricketBanner
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        cricketLoading={cricketLoading}
                        cricketMatches={cricketMatches}
                    />
                ) : !['foryou', 'cricket', 'report', 'cms'].includes(activeTab) ? (
                    <MainAdBanner
                        isAdMinimized={isAdMinimized}
                        setIsAdMinimized={setIsAdMinimized}
                        topHeadlines={topHeadlines}
                        handleOpenArticle={handleOpenArticle}
                    />
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">

                    <div id="primary-articles-column" className={['cms', 'cricket', 'fifa', 'fifaAllScores'].includes(activeTab) ? "md:col-span-3 lg:col-span-4 space-y-6" : "md:col-span-2 lg:col-span-3 space-y-6"}>

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
                                        behaviorProfile={behaviorProfile}
                                        resetBehaviorProfile={resetBehaviorProfile}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search & Discovery Bar */}
                        {['trending', 'foryou', 'sports', 'business', 'politics', 'scienceTech', 'entertainment'].includes(activeTab) && (
                            <SearchBar
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                                sortOption={sortOption}
                                setSortOption={setSortOption}
                            />
                        )}

                        <div id="feed-results-container" className="space-y-4">

                            {(activeTab === 'trending' || activeTab === 'foryou') && (
                                <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                                                {activeTab === 'trending' ? 'Trending Spotlight Indexes' : 'Personal Intel Briefing'}
                                            </h3>
                                            {selectedMenuCategory !== 'All' && (
                                                <span className="text-[10px] font-mono tracking-widest font-black uppercase px-2 py-0.5 border bg-portal-brand/10 text-portal-brand border-portal-brand/30">
                                                    {selectedMenuCategory}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
                                            {activeTab === 'trending' ? `${filteredTrending.length} indexes` : 'Curated'}
                                        </span>
                                    </div>

                                    {activeTab === 'trending' ? (
                                        <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                                            <Flame size={12} className="text-[#ef4444] animate-pulse" />
                                            <span>Updated in Real-Time</span>
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
                                            <div className="flex flex-col items-center justify-center p-20 text-portal-text-muted border border-dashed border-portal-border bg-portal-surface md:col-span-2">
                                                <AlertCircle size={40} className="mb-4 opacity-50" />
                                                <p className="text-sm font-mono">NO RECORDS FOUND IN INDEX</p>
                                            </div>
                                        ) : (
                                            (() => {
                                                const isBannerVisible = true;

                                                const seenTitles = new Set();
                                                const validArticles = [...filteredTrending]
                                                    .filter(art => {
                                                        if (failedImages.includes(art.id)) return false;
                                                        if (seenTitles.has(art.title)) return false;
                                                        seenTitles.add(art.title);
                                                        if (isBannerVisible && topHeadlineIds.has(art.id)) return false;
                                                        return true;
                                                    });

                                                const mainArticles = validArticles.slice(0, trendingLimit);

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

                                    {activeTab === 'trending' && filteredTrending.length > 0 && (
                                        <InfiniteScroll
                                            onIntersect={() => setTrendingLimit(prev => prev + 10)}
                                            hasMore={trendingLimit < filteredTrending.length}
                                        />
                                    )}

                                    {activeTab === 'foryou' && (
                                        isGeneratingBriefing ? (
                                            Array.from({ length: 4 }).map((_, i) => (
                                                <SkeletonArticleCard key={i} index={i} />
                                            ))
                                        ) : filteredPersonalized.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center p-20 text-portal-text-muted border border-dashed border-portal-border bg-portal-surface md:col-span-2">
                                                <AlertCircle size={40} className="mb-4 opacity-50 text-portal-accent" />
                                                <p className="text-sm font-mono text-portal-accent mb-2">INTELLIGENCE BRIEFING EMPTY</p>
                                                <p className="text-xs max-w-md text-center opacity-70">
                                                    We couldn't formulate a brief based on your current tracking parameters. Modify your interests or try generating again.
                                                </p>
                                            </div>
                                        ) : (
                                            (() => {
                                                const topImplicitKeywords = Object.entries(behaviorProfile.keywords)
                                                    .sort((a, b) => b[1] - a[1])
                                                    .slice(0, 5)
                                                    .map(e => e[0]);

                                                const renderedKeywords = new Set<string>();

                                                return filteredPersonalized.slice(0, foryouLimit).map((art, idx) => {
                                                    let sectionHeader = null;
                                                    const text = (art.title + ' ' + art.summary).toLowerCase();
                                                    const matchedImplicit = topImplicitKeywords.find(kw => text.includes(kw));

                                                    if (matchedImplicit && !renderedKeywords.has(matchedImplicit)) {
                                                        renderedKeywords.add(matchedImplicit);
                                                        sectionHeader = (
                                                            <div className="col-span-1 md:col-span-2 pt-4 pb-2 border-b border-portal-border/50 mb-2 mt-2 flex items-center gap-2">
                                                                <Activity size={14} className="text-portal-brand animate-pulse" />
                                                                <span className="text-xs font-mono text-portal-text-muted uppercase">Based on your interest in <span className="text-portal-text-main font-bold">#{matchedImplicit}</span></span>
                                                            </div>
                                                        );
                                                    } else if (idx === 0 && !matchedImplicit) {
                                                        sectionHeader = (
                                                            <div className="col-span-1 md:col-span-2 pt-4 pb-2 border-b border-portal-border/50 mb-2 mt-2 flex items-center gap-2">
                                                                <Sparkles size={14} className="text-portal-brand animate-pulse" />
                                                                <span className="text-xs font-mono text-portal-text-muted uppercase">Top Picks For You</span>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <React.Fragment key={art.id}>
                                                            {sectionHeader}
                                                            <ArticleCard
                                                                index={idx}
                                                                art={art}
                                                                handleOpenArticle={handleOpenArticle}
                                                                toggleBookmark={toggleBookmark}
                                                                isBookmarked={bookmarks.includes(art.id)}
                                                                isCustomFeed
                                                                setFailedImages={setFailedImages}
                                                            />
                                                        </React.Fragment>
                                                    );
                                                });
                                            })()
                                        )
                                    )}

                                    {activeTab === 'foryou' && filteredPersonalized.length > 0 && !isGeneratingBriefing && (
                                        <InfiniteScroll
                                            onIntersect={() => setForyouLimit(prev => prev + 10)}
                                            hasMore={foryouLimit < filteredPersonalized.length}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>

                            {activeTab === 'trending' && filteredTrending.length > 0 && (
                                (() => {
                                    const topHeadlineIds = new Set(
                                        [...filteredTrending]
                                            .filter(art => !failedImages.includes(art.id))
                                            .sort((a, b) => {
                                                const tb = new Date(b.publishedAt || b.date).getTime();
                                                const ta = new Date(a.publishedAt || a.date).getTime();
                                                return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
                                            })
                                            .slice(0, 3)
                                            .map(a => a.id)
                                    );

                                    const isBannerVisible = true;

                                    const seenTitles = new Set();
                                    const validArticles = [...filteredTrending]
                                        .filter(art => {
                                            if (failedImages.includes(art.id)) return false;
                                            if (seenTitles.has(art.title)) return false;
                                            seenTitles.add(art.title);
                                            if (isBannerVisible && topHeadlineIds.has(art.id)) return false;
                                            return true;
                                        });

                                    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
                                    const nonGoogle = validArticles.filter(art => !isGoogle(art));
                                    const googleArticles = validArticles.filter(art => isGoogle(art));

                                    const overflowArticles = nonGoogle.slice(43);
                                    const displayGoogleArticles = googleArticles.slice(0, 40);

                                    if (overflowArticles.length === 0 && displayGoogleArticles.length === 0) return null;

                                    return (
                                        <>
                                            {overflowArticles.length > 0 && (
                                                <MoreFromWire
                                                    articles={overflowArticles}
                                                    handleOpenArticle={handleOpenArticle}
                                                    toggleBookmark={toggleBookmark}
                                                    bookmarks={bookmarks}
                                                    failedImages={failedImages}
                                                    setFailedImages={setFailedImages}
                                                />
                                            )}
                                            {nonGoogle.length === 0 && displayGoogleArticles.length > 0 && (
                                                <GoogleNewsSection
                                                    articles={displayGoogleArticles}
                                                    handleOpenArticle={handleOpenArticle}
                                                    toggleBookmark={toggleBookmark}
                                                    bookmarks={bookmarks}
                                                    failedImages={failedImages}
                                                    setFailedImages={setFailedImages}
                                                />
                                            )}
                                        </>
                                    );
                                })()
                            )}

                            <React.Suspense fallback={<div className="p-10 flex justify-center text-portal-brand animate-pulse font-mono tracking-widest text-xs">LOADING PORTAL...</div>}>
                                {activeTab === 'globalTv' && <GlobalPage theme={portalTheme} />}
                                {activeTab === 'local' && (
                                    <LocalPage
                                        theme={portalTheme}
                                        articles={trendingArticles.filter(art => !topHeadlineIds.has(art.id))}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                    />
                                )}
                                {activeTab === 'country' && (
                                    <CountryPage
                                        theme={portalTheme}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        selectedCountry={selectedCountry}
                                    />
                                )}
                                {activeTab === 'politics' && (
                                    <PoliticsPage
                                        theme={portalTheme}
                                        selectedCategoryFromMenu={selectedMenuCategory.startsWith('Politics:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                                        articles={trendingArticles.filter(art => {
                                            const isCat = ['Politics'].includes(art.category) && (!searchQuery || (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
                                            const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                                            return (activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion)) && !topHeadlineIds.has(art.id);
                                        })}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        clearFilters={() => { setSelectedMenuCategory('All'); setSearchQuery(''); }}
                                        fallbackArticles={topHeadlines}
                                    />
                                )}
                                {activeTab === 'business' && (
                                    <BusinessPage
                                        theme={portalTheme}
                                        selectedCategoryFromMenu={selectedMenuCategory.startsWith('Business:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                                        articles={trendingArticles.filter(art => {
                                            const isCat = ['Business', 'Finance', 'Markets'].includes(art.category) && (!searchQuery || (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
                                            const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                                            return (activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion)) && !topHeadlineIds.has(art.id);
                                        })}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        clearFilters={() => { setSelectedMenuCategory('All'); setSearchQuery(''); }}
                                        fallbackArticles={topHeadlines}
                                    />
                                )}
                                {activeTab === 'entertainment' && (
                                    <EntertainmentPage
                                        theme={portalTheme}
                                        selectedCategoryFromMenu={selectedMenuCategory.startsWith('Entertainment:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                                        articles={trendingArticles.filter(art => {
                                            const isCat = ['Entertainment', 'Movie', 'Music'].includes(art.category) && (!searchQuery || (art.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
                                            const activeRegion = selectedMenuCategory.startsWith('Region: ') ? selectedMenuCategory.replace('Region: ', '') : 'All';
                                            return (activeRegion === 'All' ? isCat : (isCat && getArticleRegion(art.source) === activeRegion)) && !topHeadlineIds.has(art.id);
                                        })}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        clearFilters={() => { setSelectedMenuCategory('All'); setSearchQuery(''); }}
                                        fallbackArticles={topHeadlines}
                                    />
                                )}
                                {activeTab === 'scienceTech' && (
                                    <ScienceTechPage
                                        theme={portalTheme}
                                        selectedCategoryFromMenu={selectedMenuCategory.startsWith('Science & Tech:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                                        articles={trendingArticles.filter(art => ['Science', 'Technology', 'Science & Tech', 'Computing', 'Space', 'Cybersecurity'].includes(art.category) && (!searchQuery || (art.title || '').toLowerCase().includes(searchQuery.toLowerCase())) && !topHeadlineIds.has(art.id))}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        clearFilters={() => { setSelectedMenuCategory('All'); setSearchQuery(''); }}
                                        fallbackArticles={topHeadlines}
                                    />
                                )}
                                {activeTab === 'report' && <ReportNewsPage />}
                                {activeTab === 'sports' && (
                                    <SportsPage
                                        theme={portalTheme}
                                        articles={trendingArticles.filter(art => ['Sports', 'Athletics'].includes(art.category) && (!searchQuery || (art.title || '').toLowerCase().includes(searchQuery.toLowerCase())) && !topHeadlineIds.has(art.id))}
                                        selectedSportFromMenu={selectedMenuCategory.startsWith('Sports:') ? selectedMenuCategory.split(':')[1].trim() : 'All'}
                                        handleOpenArticle={handleOpenArticle}
                                        toggleBookmark={toggleBookmark}
                                        bookmarks={bookmarks}
                                        failedImages={failedImages}
                                        setFailedImages={setFailedImages}
                                        setActiveTab={setActiveTab}
                                        clearFilters={() => { setSelectedMenuCategory('All'); setSearchQuery(''); }}
                                        fallbackArticles={topHeadlines}
                                    />
                                )}

                                {activeTab === 'cricket' && <CricketLivePage />}
                                {activeTab === 'cms' && adminToken && (
                                    <CmsPage
                                        theme={portalTheme}
                                        token={adminToken}
                                        onLogout={() => {
                                            setAdminToken(null);
                                            localStorage.removeItem('adminToken');
                                            setActiveTab('trending');
                                        }}
                                        handleOpenArticle={handleOpenArticle}
                                    />
                                )}
                                {activeTab === 'cms' && !adminToken && (
                                    <div className="text-center py-20 text-red-500 font-mono">
                                        Unauthorized access. Please login via Ctrl+Shift+L.
                                    </div>
                                )}
                            </React.Suspense>

                        </div>
                    </div>

                    {!['cms', 'cricket', 'fifa', 'fifaAllScores'].includes(activeTab) && (
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
                            selectedMenuCategory={selectedMenuCategory}
                            topHeadlineIds={topHeadlineIds}
                        />
                    )}
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
                        <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
                        <span>{siteConfig.siteTitle || 'The Horizon Post Online'}</span>
                        <span className="ml-4">{siteConfig.footerText || '© 2026 THE HORIZON POST INC'}</span>
                    </div>
                </div>
                <div className="w-full text-center mt-2 text-[8px] text-portal-text-muted/60 max-w-4xl mx-auto">
                    Disclaimer: All product and company names, including FIFA, ICC, and others, are trademarks™ or registered® trademarks of their respective holders. Use of them does not imply any affiliation with or endorsement by them.
                </div>
            </footer>
        </div>
    );
}
