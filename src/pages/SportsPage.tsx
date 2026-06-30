import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import SkeletonArticleCard from '../components/SkeletonArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import GoogleNewsSection from '../components/GoogleNewsSection';
import EmptyFeedState from '../components/EmptyFeedState';
import { Trophy, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRssFeeds } from '../utils/useRssFeeds';

interface SportsPageProps {
    theme: 'dark' | 'light' | 'sepia';
    articles: NewsArticle[];
    selectedSportFromMenu: string;
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages?: string[];
    setFailedImages?: (f: any) => void;
    setActiveTab?: (tab: string) => void;
    clearFilters?: () => void;
    fallbackArticles?: NewsArticle[];
}

const timeAgo = (dateStr: string) => {
    // Ensure the date is parsed as UTC to prevent local timezone offsets from artificially aging the articles
    let parsedDateStr = dateStr;
    if (!dateStr.includes('T') && !dateStr.includes('Z')) {
        parsedDateStr = dateStr.replace(' ', 'T') + 'Z';
    }

    const diff = Date.now() - new Date(parsedDateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;

    return `${Math.floor(hrs / 24)}d ago`;
};

const SPORTS_FEEDS: Record<string, { source: string; url: string; sportName: string }[]> = {
    All: [
        { source: 'BBC Football', url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', sportName: 'Football' },
        { source: 'ESPN Soccer', url: 'https://www.espn.com/espn/rss/soccer/news', sportName: 'Football' },
        { source: 'Yahoo Soccer', url: 'https://sports.yahoo.com/soccer/rss.xml', sportName: 'Football' },
        { source: 'ESPN Top Sports', url: 'https://www.espn.com/espn/rss/news', sportName: 'Sports' },
        { source: 'ESPN NFL', url: 'https://www.espn.com/espn/rss/nfl/news', sportName: 'American Football' },
        { source: 'Yahoo NFL', url: 'https://sports.yahoo.com/nfl/rss.xml', sportName: 'American Football' },
        { source: 'ESPN NBA', url: 'https://www.espn.com/espn/rss/nba/news', sportName: 'Basketball' },
        { source: 'Yahoo NBA', url: 'https://sports.yahoo.com/nba/rss.xml', sportName: 'Basketball' },
        { source: 'ESPN MLB', url: 'https://www.espn.com/espn/rss/mlb/news', sportName: 'Baseball' },
        { source: 'Yahoo MLB', url: 'https://sports.yahoo.com/mlb/rss.xml', sportName: 'Baseball' },
        { source: 'ESPN NHL', url: 'https://www.espn.com/espn/rss/nhl/news', sportName: 'Ice Hockey' },
        { source: 'Yahoo NHL', url: 'https://sports.yahoo.com/nhl/rss.xml', sportName: 'Ice Hockey' },
        { source: 'ESPN F1', url: 'https://www.espn.com/espn/rss/f1/news', sportName: 'Motorsport' },
        { source: 'Yahoo Racing', url: 'https://sports.yahoo.com/nascar/rss.xml', sportName: 'Motorsport' },
        { source: 'BBC Tennis', url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', sportName: 'Tennis' },
        { source: 'Yahoo Tennis', url: 'https://sports.yahoo.com/tennis/rss.xml', sportName: 'Tennis' },
        { source: 'BBC Cricket', url: 'http://feeds.bbci.co.uk/sport/cricket/rss.xml', sportName: 'Cricket' },
        { source: 'Yahoo Cricket', url: 'https://sports.yahoo.com/cricket/rss.xml', sportName: 'Cricket' },
        { source: 'Sky Sports Golf', url: 'https://www.skysports.com/rss/12138', sportName: 'Golf' },
        { source: 'BBC Golf', url: 'http://feeds.bbci.co.uk/sport/golf/rss.xml', sportName: 'Golf' },
        { source: 'Sky Sports Boxing/MMA', url: 'https://www.skysports.com/rss/12183', sportName: 'Boxing/MMA' },
        { source: 'Yahoo MMA', url: 'https://sports.yahoo.com/mma/rss.xml', sportName: 'Boxing/MMA' },
        { source: 'Sky Sports Rugby', url: 'https://www.skysports.com/rss/12056', sportName: 'Rugby' },
        { source: 'BBC Rugby Union', url: 'http://feeds.bbci.co.uk/sport/rugby-union/rss.xml', sportName: 'Rugby' },
        { source: 'BBC Athletics', url: 'http://feeds.bbci.co.uk/sport/athletics/rss.xml', sportName: 'Athletics' },
        { source: 'BBC Cycling', url: 'http://feeds.bbci.co.uk/sport/cycling/rss.xml', sportName: 'Cycling' }
    ],
    Football: [
        { source: 'BBC Football', url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', sportName: 'Football' },
        { source: 'ESPN Soccer', url: 'https://www.espn.com/espn/rss/soccer/news', sportName: 'Football' },
        { source: 'Yahoo Soccer', url: 'https://sports.yahoo.com/soccer/rss.xml', sportName: 'Football' }
    ],
    Tennis: [
        { source: 'BBC Tennis', url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', sportName: 'Tennis' },
        { source: 'Yahoo Tennis', url: 'https://sports.yahoo.com/tennis/rss.xml', sportName: 'Tennis' }
    ],
    Motorsport: [
        { source: 'ESPN F1', url: 'https://www.espn.com/espn/rss/f1/news', sportName: 'Motorsport' },
        { source: 'Yahoo Racing', url: 'https://sports.yahoo.com/nascar/rss.xml', sportName: 'Motorsport' }
    ],
    Basketball: [
        { source: 'ESPN NBA', url: 'https://www.espn.com/espn/rss/nba/news', sportName: 'Basketball' },
        { source: 'Yahoo NBA', url: 'https://sports.yahoo.com/nba/rss.xml', sportName: 'Basketball' }
    ],
    'American Football': [
        { source: 'ESPN NFL', url: 'https://www.espn.com/espn/rss/nfl/news', sportName: 'American Football' },
        { source: 'Yahoo NFL', url: 'https://sports.yahoo.com/nfl/rss.xml', sportName: 'American Football' }
    ],
    Baseball: [
        { source: 'ESPN MLB', url: 'https://www.espn.com/espn/rss/mlb/news', sportName: 'Baseball' },
        { source: 'Yahoo MLB', url: 'https://sports.yahoo.com/mlb/rss.xml', sportName: 'Baseball' }
    ],
    'Ice Hockey': [
        { source: 'ESPN NHL', url: 'https://www.espn.com/espn/rss/nhl/news', sportName: 'Ice Hockey' },
        { source: 'Yahoo NHL', url: 'https://sports.yahoo.com/nhl/rss.xml', sportName: 'Ice Hockey' }
    ],
    Cricket: [
        { source: 'BBC Cricket', url: 'http://feeds.bbci.co.uk/sport/cricket/rss.xml', sportName: 'Cricket' },
        { source: 'Yahoo Cricket', url: 'https://sports.yahoo.com/cricket/rss.xml', sportName: 'Cricket' }
    ],
    Golf: [
        { source: 'Sky Sports Golf', url: 'https://www.skysports.com/rss/12138', sportName: 'Golf' },
        { source: 'BBC Golf', url: 'http://feeds.bbci.co.uk/sport/golf/rss.xml', sportName: 'Golf' }
    ],
    'Boxing/MMA': [
        { source: 'Sky Sports Boxing/MMA', url: 'https://www.skysports.com/rss/12183', sportName: 'Boxing/MMA' },
        { source: 'Yahoo MMA', url: 'https://sports.yahoo.com/mma/rss.xml', sportName: 'Boxing/MMA' }
    ],
    Rugby: [
        { source: 'Sky Sports Rugby', url: 'https://www.skysports.com/rss/12056', sportName: 'Rugby' },
        { source: 'BBC Rugby Union', url: 'http://feeds.bbci.co.uk/sport/rugby-union/rss.xml', sportName: 'Rugby' }
    ],
    Athletics: [
        { source: 'BBC Athletics', url: 'http://feeds.bbci.co.uk/sport/athletics/rss.xml', sportName: 'Athletics' }
    ],
    Cycling: [
        { source: 'BBC Cycling', url: 'http://feeds.bbci.co.uk/sport/cycling/rss.xml', sportName: 'Cycling' }
    ]
};

// Generate transparent SVG patterns for elegant fallbacks
const generateSvgPattern = (type: string) => {
    let patternContent = '';
    let pw = 40, ph = 40;

    // Universal subtle color that works on dark/light/sepia modes (gray with 15% opacity)
    const color = '%2388888825';

    if (type === 'stripes') {
        patternContent = `<rect width="20" height="40" fill="${color}"/>`;
    } else if (type === 'checkered') {
        patternContent = `<rect width="20" height="20" fill="${color}"/><rect x="20" y="20" width="20" height="20" fill="${color}"/>`;
    } else if (type === 'dots') {
        pw = 20; ph = 20;
        patternContent = `<circle cx="10" cy="10" r="2" fill="${color}"/>`;
    } else if (type === 'grid') {
        patternContent = `<path d="M0 20h40M20 0v40" stroke="${color}" stroke-width="1"/>`;
    } else {
        pw = 20; ph = 20;
        patternContent = `<path d="M0 20L20 0M-5 5L5 -5M15 25L25 15" stroke="${color}" stroke-width="1"/>`;
    }

    const svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" width="${pw}" height="${ph}" patternUnits="userSpaceOnUse">${patternContent}</pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`;

    return `data:image/svg+xml;utf8,${svg}`;
};

const SPORT_IMAGES: Record<string, string> = {
    Football: generateSvgPattern('stripes'),
    Tennis: generateSvgPattern('grid'),
    Motorsport: generateSvgPattern('checkered'),
    Cricket: generateSvgPattern('stripes'),
    Golf: generateSvgPattern('dots'),
    'Boxing/MMA': generateSvgPattern('diagonal'),
    Rugby: generateSvgPattern('stripes'),
    Athletics: generateSvgPattern('diagonal'),
    Cycling: generateSvgPattern('dots'),
    Basketball: generateSvgPattern('grid'),
    'American Football': generateSvgPattern('stripes'),
    Baseball: generateSvgPattern('diagonal'),
    'Ice Hockey': generateSvgPattern('grid'),
    All: generateSvgPattern('dots'),
    Sports: generateSvgPattern('dots')
};

export default function SportsPage({ articles, selectedSportFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages, setActiveTab, clearFilters, fallbackArticles }: SportsPageProps) {
    const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { fetchFeeds } = useRssFeeds();

    useEffect(() => {
        const fetchLiveNews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const feedsToFetch = SPORTS_FEEDS[selectedSportFromMenu] || [];
                const { results } = await fetchFeeds(feedsToFetch);

                const combinedResults: NewsArticle[] = [];
                results.forEach((data) => {
                    const feed = data.feedConfig;
                    if (data.items) {
                        const mapped = data.items.map((item: any, idx: number) => ({
                            id: `live-sport-${feed.source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
                            title: item.title,
                            summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
                            content: item.content || item.description || '',
                            imageUrl: item.enclosure?.link || item.thumbnail || undefined,
                            category: 'Sports',
                            sportName: feed.sportName,
                            source: feed.source,
                            author: item.author || feed.source,
                            publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                            timeAgo: item.pubDate ? timeAgo(item.pubDate) : 'Live',
                            readTime: '3 min read',
                            url: item.link
                        }));
                        combinedResults.push(...mapped);
                    }
                });

                if (combinedResults.length > 0) {
                    // Deduplicate by title
                    const seen = new Set<string>();
                    const deduped = combinedResults.filter(art => {
                        const titleNorm = art.title.toLowerCase().trim();
                        if (seen.has(titleNorm)) return false;
                        seen.add(titleNorm);
                        return true;
                    });

                    setLiveArticles(deduped);
                } else {
                    setError('Failed to parse live sports feed from external server.');
                }
            } catch (err) {
                setError('Connection error. Could not establish live sports uplink.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveNews();
    }, [selectedSportFromMenu, fetchFeeds]);

    const combinedArticles = (selectedSportFromMenu === 'All'
        ? [...liveArticles, ...articles]
        : [...liveArticles, ...articles.filter(art =>
            art.sportName === selectedSportFromMenu ||
            art.title.toLowerCase().includes(selectedSportFromMenu.toLowerCase()) ||
            art.summary?.toLowerCase().includes(selectedSportFromMenu.toLowerCase())
        )]).filter(art => !!art.imageUrl && !art.imageUrl.startsWith('data:image/svg+xml') && !failedImages?.includes(art.id));

    // Sort articles by date descending
    const timeSorted = combinedArticles.sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.date || Date.now()).getTime();
        const timeB = new Date(b.publishedAt || b.date || Date.now()).getTime();
        return timeB - timeA;
    });

    // Strong deduplication with exact and fuzzy matching
    const allSorted: NewsArticle[] = [];
    for (const art of timeSorted) {
        let isDuplicate = false;
        const artTitleClean = art.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const artWords = new Set(artTitleClean.split(/\s+/).filter(w => w.length > 3));

        for (const existing of allSorted) {
            // Exact or very close match
            if (existing.title.toLowerCase().trim() === art.title.toLowerCase().trim()) {
                isDuplicate = true;
                break;
            }

            // Fuzzy word overlap match (Jaccard similarity)
            const existingTitleClean = existing.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
            const existingWords = new Set(existingTitleClean.split(/\s+/).filter(w => w.length > 3));

            if (artWords.size > 0 && existingWords.size > 0) {
                const intersection = new Set([...artWords].filter(x => existingWords.has(x)));
                const union = new Set([...artWords, ...existingWords]);
                const similarity = intersection.size / union.size;

                // If 50% or more of the meaningful words overlap, consider it the same story
                if (similarity >= 0.5) {
                    isDuplicate = true;
                    break;
                }
            }
        }
        if (!isDuplicate) {
            allSorted.push(art);
        }
    }

    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
    const nonGoogle = allSorted.filter(art => !isGoogle(art));
    const googleArticles = allSorted.filter(art => isGoogle(art));

    const displayArticles = nonGoogle.slice(0, 10);
    const overflowArticles = nonGoogle.slice(10);
    const displayGoogleArticles = googleArticles.slice(0, 40);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                <div className="flex items-center space-x-3">
                    <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                        {selectedSportFromMenu === 'All' ? 'Global Sports Feed' : `${selectedSportFromMenu} Feed`}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50 flex items-center gap-1.5">
                        {isLoading ? <RefreshCw size={10} className="animate-spin" /> : <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>}
                        {allSorted.length} updates
                    </span>
                </div>
                <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                    <Trophy size={12} className="text-yellow-500" />
                    <span className="hidden sm:inline">Live Sports Radar</span>
                </div>
            </div>

            {error && (
                <div className="p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-xs font-mono text-center">
                    {error}
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                <AnimatePresence>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonArticleCard key={`skel-${i}`} index={i} />
                        ))
                    ) : displayArticles.length === 0 ? (
                        <EmptyFeedState 
                            onClearFilters={clearFilters || (() => {})} 
                            fallbackArticles={fallbackArticles || []} 
                            handleOpenArticle={handleOpenArticle} 
                        />
                    ) : (
                        displayArticles.map((art, idx) => (
                            <ArticleCard
                                key={art.id}
                                index={idx}
                                art={art}
                                handleOpenArticle={handleOpenArticle}
                                toggleBookmark={toggleBookmark}
                                isBookmarked={bookmarks.includes(art.id)}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {!isLoading && overflowArticles.length > 0 && (
                <MoreFromWire
                    articles={overflowArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages || []}
                    setFailedImages={setFailedImages || (() => { })}
                />
            )}

            {nonGoogle.length === 0 && displayGoogleArticles.length > 0 && (
                <GoogleNewsSection
                    articles={displayGoogleArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages || []}
                    setFailedImages={setFailedImages || (() => { })}
                />
            )}
        </div>
    );
}
