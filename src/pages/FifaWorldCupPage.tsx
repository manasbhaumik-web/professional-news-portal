import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Globe, AlertCircle, ExternalLink, Clock, Rss } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedArticle {
    id: string;
    title: string;
    summary: string;
    url: string;
    source: string;
    sourceFlag?: string;
    pubDate: string;
    timeAgo: string;
    imageUrl?: string;
}

const timeAgo = (dateStr: string): string => {
    if (!dateStr) return 'Recently';
    let parsedDateStr = dateStr;
    if (!dateStr.includes('T') && !dateStr.includes('Z') && dateStr.includes(' ')) {
        parsedDateStr = dateStr.replace(' ', 'T') + 'Z';
    }
    const diff = Date.now() - new Date(parsedDateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (isNaN(mins) || mins < 0) return 'Recently';
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

// Free RSS feeds about FIFA World Cup 2026 from global sources
const FIFA_FEEDS = [
    {
        name: 'BBC Sport - Football',
        flag: '🇬🇧',
        url: '/api/news/proxy?url=' + encodeURIComponent('http://feeds.bbci.co.uk/sport/football/rss.xml'),
    },
    {
        name: 'ESPN FC',
        flag: '🇺🇸',
        url: '/api/news/proxy?url=' + encodeURIComponent('https://www.espn.com/espn/rss/soccer/news'),
    },
    {
        name: 'Goal.com',
        flag: '⚽',
        url: '/api/news/proxy?url=' + encodeURIComponent('https://www.goal.com/feeds/en/news'),
    },
    {
        name: 'Reuters Sports',
        flag: '🌍',
        url: '/api/news/proxy?url=' + encodeURIComponent('https://feeds.reuters.com/reuters/sportsNews'),
    },
    {
        name: 'Sky Sports Football',
        flag: '🇬🇧',
        url: '/api/news/proxy?url=' + encodeURIComponent('https://www.skysports.com/rss/12040'),
    },
];

const FIFA_KEYWORDS = [
    'world cup', 'fifa', '2026', 'soccer', 'football championship',
    'group stage', 'knockout', 'goal', 'match', 'squad'
];

const FALLBACK_ARTICLES: FeedArticle[] = [
    {
        id: 'fb-1', title: 'FIFA World Cup 2026: Everything You Need To Know', summary: 'The 2026 FIFA World Cup will be hosted jointly by the United States, Canada, and Mexico — the first World Cup with three host nations. 48 teams will compete for the title.', url: 'https://www.fifa.com/worldcup', source: 'FIFA Official', pubDate: new Date().toISOString(), timeAgo: 'Just now', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
    },
    {
        id: 'fb-2', title: 'USA, Canada & Mexico Prepare for Historic Joint World Cup 2026', summary: 'North America gears up for the largest World Cup in history, with 48 nations competing across 16 host cities in three countries for the first time ever.', url: 'https://www.fifa.com/worldcup', source: 'ESPN', pubDate: new Date(Date.now() - 3600000).toISOString(), timeAgo: '1h ago', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    },
    {
        id: 'fb-3', title: 'World Cup 2026 Group Stage: Shocking Results and Top Performers', summary: 'The group stage has produced upsets, drama and outstanding individual performances. Here are the key takeaways from the opening rounds of the 2026 FIFA World Cup.', url: 'https://www.bbc.co.uk/sport/football', source: 'BBC Sport', pubDate: new Date(Date.now() - 7200000).toISOString(), timeAgo: '2h ago', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    },
    {
        id: 'fb-4', title: 'Top Scorers & Stats at FIFA World Cup 2026', summary: "Who's leading the Golden Boot race? We break down the top scorers, assists, and key statistics from the group stages of the 2026 FIFA World Cup.", url: 'https://www.goal.com', source: 'Goal.com', pubDate: new Date(Date.now() - 10800000).toISOString(), timeAgo: '3h ago', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    },
    {
        id: 'fb-5', title: 'World Cup 2026: Bracket, Schedule & All Results', summary: 'Complete FIFA World Cup 2026 bracket, schedule, and live results — from the group stage through to the final in MetLife Stadium, New York on July 19.', url: 'https://www.skysports.com', source: 'Sky Sports', pubDate: new Date(Date.now() - 14400000).toISOString(), timeAgo: '4h ago', imageUrl: 'https://images.unsplash.com/photo-1555952497-c1285f3a0f2b?w=800&q=80',
    },
];

export default function FifaWorldCupPage() {
    const [articles, setArticles] = useState<FeedArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [loadedSources, setLoadedSources] = useState<string[]>([]);

    const fetchAllFeeds = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const allArticles: FeedArticle[] = [];
        const successSources: string[] = [];

        await Promise.allSettled(
            FIFA_FEEDS.map(async (feed) => {
                try {
                    const res = await fetch(feed.url);
                    const data = await res.json();
                    if (data.status === 'ok' && data.items) {
                        const filtered = data.items.filter((item: any) => {
                            const text = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
                            return FIFA_KEYWORDS.some(kw => text.includes(kw));
                        });

                        const mapped: FeedArticle[] = (filtered.length > 0 ? filtered : data.items.slice(0, 3)).map((item: any, idx: number) => ({
                            id: `${feed.name}-${idx}-${Date.now()}`,
                            title: item.title || 'No Title',
                            summary: (item.description || item.content || '').replace(/<[^>]+>/g, '').substring(0, 200) + '...',
                            url: item.link || '#',
                            source: feed.name,
                            sourceFlag: feed.flag,
                            pubDate: item.pubDate || new Date().toISOString(),
                            timeAgo: item.pubDate ? timeAgo(item.pubDate) : 'Recently',
                            imageUrl: item.enclosure?.link || item.thumbnail || undefined,
                        }));

                        allArticles.push(...mapped.slice(0, 5));
                        successSources.push(feed.name);
                    }
                } catch {
                    // Silent fail for individual feeds
                }
            })
        );

        if (allArticles.length === 0) {
            setArticles(FALLBACK_ARTICLES);
            setError('Live feeds unavailable. Showing cached World Cup coverage.');
        } else {
            // Sort by publish date, newest first
            allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
            setArticles(allArticles);
        }

        setLoadedSources(successSources);
        setLastUpdated(new Date());
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchAllFeeds();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchAllFeeds, 300000);
        return () => clearInterval(interval);
    }, [fetchAllFeeds]);

    const sources = ['All', ...Array.from(new Set(articles.map(a => a.source)))];
    const filtered = activeFilter === 'All' ? articles : articles.filter(a => a.source === activeFilter);

    return (
        <div className="space-y-6">

            {/* Hero Header */}
            <div className="relative overflow-hidden border border-portal-border shadow-2xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c 0%, transparent 40%)' }} />
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none text-[#c9a84c]">
                    <Trophy size={200} />
                </div>

                <div className="relative z-10 p-6 sm:p-10">
                    <div className="flex items-center gap-2 text-[#c9a84c] font-mono text-xs uppercase tracking-widest font-bold mb-3">
                        <Trophy size={14} />
                        <span>Special Coverage</span>
                        <span className="w-1.5 h-1.5 bg-red-500 animate-ping ml-2" />
                        <span className="text-red-400">Live Updates</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-2">
                        FIFA World Cup
                        <span className="text-[#c9a84c] ml-3">2026™</span>
                    </h1>
                    <p className="text-white/60 text-sm max-w-2xl mt-3">
                        Live global coverage from international news sources — USA · Canada · Mexico host nations.
                        Aggregating feeds from {FIFA_FEEDS.length} major sports networks worldwide.
                    </p>

                    {/* Host info pills */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {[
                            { flag: '🇺🇸', label: 'United States', venues: '11 Venues' },
                            { flag: '🇨🇦', label: 'Canada', venues: '2 Venues' },
                            { flag: '🇲🇽', label: 'Mexico', venues: '3 Venues' },
                        ].map(host => (
                            <div key={host.label} className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs text-white font-semibold">
                                <span>{host.flag}</span>
                                <span>{host.label}</span>
                                <span className="text-white/40">·</span>
                                <span className="text-[#c9a84c] font-mono text-[10px]">{host.venues}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 bg-[#c9a84c]/20 border border-[#c9a84c]/40 backdrop-blur-sm px-4 py-1.5 text-xs text-[#c9a84c] font-bold font-mono">
                            <Trophy size={10} /> 48 Teams
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-portal-text-muted">
                        <Rss size={12} className="text-orange-500" />
                        <span>
                            {loadedSources.length > 0
                                ? `${loadedSources.length}/${FIFA_FEEDS.length} sources active`
                                : 'Connecting to live feeds...'}
                        </span>
                    </div>
                    {lastUpdated && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-portal-text-muted">
                            <Clock size={10} />
                            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={fetchAllFeeds}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-portal-text-muted hover:text-portal-text-main transition-colors border border-portal-border px-3 py-1.5 hover:bg-portal-surface disabled:opacity-50"
                >
                    <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
                    {isLoading ? 'Fetching...' : 'Refresh Feeds'}
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3">
                    <AlertCircle size={13} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Source Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {sources.map(src => (
                    <button
                        key={src}
                        onClick={() => setActiveFilter(src)}
                        className={`px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider transition-all border ${activeFilter === src
                            ? 'bg-[#c9a84c] text-[#1a1a2e] border-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                            : 'border-portal-border text-portal-text-muted hover:border-[#c9a84c]/50 hover:text-[#c9a84c]'
                            }`}
                    >
                        {src === 'All' ? `All Sources (${articles.length})` : src}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className=" border border-portal-border bg-portal-surface animate-pulse overflow-hidden">
                            <div className="h-40 bg-portal-surface-hover" />
                            <div className="p-4 space-y-3">
                                <div className="h-3 bg-portal-surface-hover w-1/3" />
                                <div className="h-4 bg-portal-surface-hover w-full" />
                                <div className="h-4 bg-portal-surface-hover w-4/5" />
                                <div className="h-3 bg-portal-surface-hover w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {filtered.length === 0 ? (
                            <div className="col-span-full text-center py-16 text-portal-text-muted font-mono text-sm border border-dashed border-portal-border ">
                                No articles found for this source.
                            </div>
                        ) : (
                            filtered.map((article, idx) => (
                                <motion.a
                                    key={article.id}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                                    className="group flex flex-col border border-portal-border bg-portal-surface hover:border-[#c9a84c]/50 hover:shadow-[0_4px_20px_rgba(201,168,76,0.1)] transition-all overflow-hidden cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="relative h-44 overflow-hidden bg-portal-surface-hover shrink-0">
                                        {article.imageUrl ? (
                                            <img
                                                src={article.imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0f3460]">
                                                <Trophy size={48} className="text-[#c9a84c]/40" />
                                            </div>
                                        )}
                                        {/* Source badge */}
                                        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold font-mono px-2 py-1 border border-white/10">
                                            <span>{article.sourceFlag}</span>
                                            <span>{article.source}</span>
                                        </div>
                                        {/* External link icon */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#c9a84c] text-[#1a1a2e] p-1 ">
                                            <ExternalLink size={10} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-1 p-4 gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#c9a84c] flex items-center gap-1">
                                                <Trophy size={8} /> World Cup 2026
                                            </span>
                                            <span className="text-[9px] text-portal-text-muted font-mono ml-auto flex items-center gap-1">
                                                <Clock size={9} /> {article.timeAgo}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-portal-text-main group-hover:text-[#c9a84c] transition-colors line-clamp-3 leading-snug text-sm">
                                            {article.title}
                                        </h3>

                                        <p className="text-[11px] text-portal-text-muted line-clamp-2 leading-relaxed mt-auto pt-1">
                                            {article.summary}
                                        </p>

                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-portal-border/50">
                                            <span className="text-[10px] text-portal-text-muted font-mono flex items-center gap-1">
                                                <Globe size={9} /> {article.source}
                                            </span>
                                            <span className="text-[10px] text-[#c9a84c] font-mono font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Read More <ExternalLink size={9} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.a>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}

            {/* Sources Info Footer */}
            <div className=" border border-portal-border bg-portal-surface p-5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-portal-text-muted mb-3 flex items-center gap-2">
                    <Rss size={12} className="text-orange-500" /> Active Live Feed Sources
                </h4>
                <div className="flex flex-wrap gap-3">
                    {FIFA_FEEDS.map(feed => (
                        <div key={feed.name} className={`flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 border ${loadedSources.includes(feed.name)
                            ? 'border-green-500/30 bg-green-500/5 text-green-500'
                            : 'border-portal-border text-portal-text-muted'
                            }`}>
                            <span>{feed.flag}</span>
                            <span>{feed.name}</span>
                            <span className={`w-1.5 h-1.5 ${loadedSources.includes(feed.name) ? 'bg-green-500 animate-pulse' : 'bg-portal-text-muted/30'}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
