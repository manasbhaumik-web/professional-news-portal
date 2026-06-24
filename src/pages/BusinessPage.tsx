import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import { Activity } from 'lucide-react';

interface BusinessPageProps {
    theme: 'dark' | 'light' | 'sepia';
    articles: NewsArticle[];
    selectedCategoryFromMenu: string;
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages?: string[];
    setFailedImages?: (f: any) => void;
}

const BUSINESS_FEEDS: Record<string, { source: string; url: string; subCategory: string }[]> = {
    All: [
        { source: 'Google Business', url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en', subCategory: 'General' },
        { source: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', subCategory: 'Economy' },
        { source: 'NYT Business', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', subCategory: 'Finance' },
        { source: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', subCategory: 'Markets' },
        { source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', subCategory: 'Finance' }
    ],
    Markets: [
        { source: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html', subCategory: 'Markets' },
        { source: 'Google News Markets', url: 'https://news.google.com/rss/search?q=Financial+Markets&hl=en-US&gl=US&ceid=US:en', subCategory: 'Markets' }
    ],
    Finance: [
        { source: 'NYT Business', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', subCategory: 'Finance' },
        { source: 'Google News Finance', url: 'https://news.google.com/rss/search?q=Corporate+Finance&hl=en-US&gl=US&ceid=US:en', subCategory: 'Finance' },
        { source: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', subCategory: 'Finance' }
    ],
    Economy: [
        { source: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', subCategory: 'Economy' },
        { source: 'Google News Economy', url: 'https://news.google.com/rss/search?q=Global+Economy&hl=en-US&gl=US&ceid=US:en', subCategory: 'Economy' }
    ],
    Startups: [
        { source: 'TechCrunch', url: 'https://techcrunch.com/category/startups/feed/', subCategory: 'Startups' },
        { source: 'Google News Startups', url: 'https://news.google.com/rss/search?q=Venture+Capital+Startups&hl=en-US&gl=US&ceid=US:en', subCategory: 'Startups' }
    ]
};

const BUSINESS_IMAGES: Record<string, string> = {
    Markets: 'https://images.unsplash.com/photo-1611974789855-9c2a0a2236a0?auto=format&fit=crop&w=800&q=80',
    Finance: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    Economy: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    Startups: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
    All: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    General: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80'
};

export default function BusinessPage({ articles, selectedCategoryFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages }: BusinessPageProps) {
    const [liveArticles, setLiveArticles] = React.useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchCategoryFeed = async () => {
            setIsLoading(true);
            try {
                const feedsToFetch = BUSINESS_FEEDS[selectedCategoryFromMenu] || [
                    { source: 'Google News', url: `https://news.google.com/rss/search?q=${encodeURIComponent(selectedCategoryFromMenu + ' Business')}`, subCategory: selectedCategoryFromMenu }
                ];

                const fetchPromises = feedsToFetch.map(async (feed) => {
                    try {
                        const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
                        if (!res.ok) return [];
                        const data = await res.json();

                        if (data.status === 'ok' && data.items) {
                            return data.items.map((item: any, idx: number) => ({
                                id: `biz-live-${feed.source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
                                title: item.title,
                                summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
                                content: item.content || item.description || '',
                                imageUrl: item.enclosure?.link || item.thumbnail || (feed.source.includes('Google') ? undefined : (BUSINESS_IMAGES[feed.subCategory] || BUSINESS_IMAGES['General'])),
                                category: 'Business',
                                sportName: feed.subCategory,
                                source: feed.source,
                                publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                                timeAgo: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Live',
                                readTime: '3 min read',
                                url: item.link
                            }));
                        }
                    } catch (err) {
                        console.error(`Error fetching feed ${feed.source}:`, err);
                    }
                    return [];
                });

                const results = await Promise.allSettled(fetchPromises);
                const combinedResults: NewsArticle[] = [];
                results.forEach(r => {
                    if (r.status === 'fulfilled') {
                        combinedResults.push(...r.value);
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
                }
            } catch (err) {
                console.error('Failed to fetch live business feed', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryFeed();
    }, [selectedCategoryFromMenu]);

    const combinedArticles = selectedCategoryFromMenu === 'All'
        ? [...liveArticles, ...articles]
        : [...liveArticles, ...articles.filter(art =>
            art.title.toLowerCase().includes(selectedCategoryFromMenu.toLowerCase()) ||
            art.summary?.toLowerCase().includes(selectedCategoryFromMenu.toLowerCase())
        )];

    const allSorted = combinedArticles.sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.date || Date.now()).getTime();
        const timeB = new Date(b.publishedAt || b.date || Date.now()).getTime();
        return timeB - timeA;
    }).filter((art, idx, self) => idx === self.findIndex(a => a.title.toLowerCase().trim() === art.title.toLowerCase().trim()));

    const displayArticles = allSorted.slice(0, 10);
    const overflowArticles = allSorted.slice(10);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Banner removed as per user request */}

            <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                <div className="flex items-center space-x-3">
                    <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                        {selectedCategoryFromMenu === 'All' ? 'Business & Finance' : `${selectedCategoryFromMenu} Feed`}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
                        {isLoading ? 'Loading...' : `${allSorted.length} indexes`}
                    </span>
                </div>
                <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                    <Activity size={12} className="text-blue-500 animate-pulse" />
                    <span className="hidden sm:inline">{selectedCategoryFromMenu === 'All' ? 'Live Market Feed' : `Live ${selectedCategoryFromMenu} Radar`}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                {displayArticles.length === 0 ? (
                    <div className="p-8 border border-dashed text-center text-xs font-mono border-portal-border text-portal-text-muted col-span-full">
                        No intelligence available for {selectedCategoryFromMenu}.
                    </div>
                ) : (
                    displayArticles.map((art, idx) => (
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
                    ))
                )}
            </div>

            {overflowArticles.length > 0 && (
                <MoreFromWire
                    articles={overflowArticles}
                    handleOpenArticle={handleOpenArticle}
                    toggleBookmark={toggleBookmark}
                    bookmarks={bookmarks}
                    failedImages={failedImages || []}
                    setFailedImages={setFailedImages || (() => {})}
                />
            )}
        </div>
    );
}
