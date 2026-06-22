import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import SkeletonArticleCard from '../components/SkeletonArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SportsPageProps {
 theme: 'dark' | 'light' | 'sepia';
 articles: NewsArticle[];
 selectedSportFromMenu: string;
 handleOpenArticle: (art: NewsArticle) => void;
 toggleBookmark: (id: string, e: React.MouseEvent) => void;
 bookmarks: string[];
 failedImages?: string[];
 setFailedImages?: (f: any) => void;
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
 { source: 'Google News', url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en', sportName: 'Sports' },
 { source: 'BBC Football', url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', sportName: 'Football' },
 { source: 'ESPN Soccer', url: 'https://www.espn.com/espn/rss/soccer/news', sportName: 'Football' },
 { source: 'ESPN Top Sports', url: 'https://www.espn.com/espn/rss/news', sportName: 'Sports' },
 { source: 'ESPN NFL', url: 'https://www.espn.com/espn/rss/nfl/news', sportName: 'American Football' },
 { source: 'ESPN NBA', url: 'https://www.espn.com/espn/rss/nba/news', sportName: 'Basketball' },
 { source: 'ESPN MLB', url: 'https://www.espn.com/espn/rss/mlb/news', sportName: 'Baseball' },
 { source: 'ESPN NHL', url: 'https://www.espn.com/espn/rss/nhl/news', sportName: 'Ice Hockey' },
 { source: 'ESPN F1', url: 'https://www.espn.com/espn/rss/f1/news', sportName: 'Motorsport' },
 { source: 'BBC Tennis', url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', sportName: 'Tennis' },
 { source: 'BBC Cricket', url: 'http://feeds.bbci.co.uk/sport/cricket/rss.xml', sportName: 'Cricket' },
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
 { source: 'ESPN Soccer', url: 'https://www.espn.com/espn/rss/soccer/news', sportName: 'Football' }
 ],
 Tennis: [
 { source: 'BBC Tennis', url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', sportName: 'Tennis' }
 ],
 Motorsport: [
 { source: 'ESPN F1', url: 'https://www.espn.com/espn/rss/f1/news', sportName: 'Motorsport' },
 { source: 'Google News Motorsport', url: 'https://news.google.com/rss/search?q=Motorsport+Sports', sportName: 'Motorsport' }
 ],
 Basketball: [
 { source: 'ESPN NBA', url: 'https://www.espn.com/espn/rss/nba/news', sportName: 'Basketball' }
 ],
 'American Football': [
 { source: 'ESPN NFL', url: 'https://www.espn.com/espn/rss/nfl/news', sportName: 'American Football' }
 ],
 Baseball: [
 { source: 'ESPN MLB', url: 'https://www.espn.com/espn/rss/mlb/news', sportName: 'Baseball' }
 ],
 'Ice Hockey': [
 { source: 'ESPN NHL', url: 'https://www.espn.com/espn/rss/nhl/news', sportName: 'Ice Hockey' }
 ],
 Cricket: [
 { source: 'BBC Cricket', url: 'http://feeds.bbci.co.uk/sport/cricket/rss.xml', sportName: 'Cricket' }
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

const SPORT_IMAGES: Record<string, string> = {
 Football: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
 Tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
 Motorsport: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
 Cricket: 'https://images.unsplash.com/photo-1531415080290-bc9854503f37?auto=format&fit=crop&w=800&q=80',
 Golf: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
 'Boxing/MMA': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
 Rugby: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
 Athletics: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
 Cycling: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
 Basketball: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
 'American Football': 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80',
 Baseball: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80',
 'Ice Hockey': 'https://images.unsplash.com/photo-1515703407324-5f753eedf9ce?auto=format&fit=crop&w=800&q=80',
 All: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
 Sports: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
};

export default function SportsPage({ articles, selectedSportFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages }: SportsPageProps) {
 const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
 const fetchLiveNews = async () => {
 setIsLoading(true);
 setError(null);
 try {
 const feedsToFetch = SPORTS_FEEDS[selectedSportFromMenu] || [
 { source: 'Google News', url: `https://news.google.com/rss/search?q=${encodeURIComponent(selectedSportFromMenu + ' Sports')}`, sportName: selectedSportFromMenu }
 ];

 const fetchPromises = feedsToFetch.map(async (feed) => {
 try {
 const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
 if (!res.ok) return [];
 const data = await res.json();
 
 if (data.status === 'ok' && data.items) {
 return data.items.map((item: any, idx: number) => ({
 id: `live-sport-${feed.source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
 title: item.title,
 summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
 content: item.content || item.description || '',
 imageUrl: item.enclosure?.link || item.thumbnail || (feed.source.includes('Google') ? undefined : (SPORT_IMAGES[feed.sportName] || SPORT_IMAGES['All'])),
 category: 'Sports',
 sportName: feed.sportName,
 source: feed.source,
 author: item.author || feed.source,
 publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
 timeAgo: item.pubDate ? timeAgo(item.pubDate) : 'Live',
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
 }, [selectedSportFromMenu]);

 const combinedArticles = selectedSportFromMenu === 'All' 
 ? [...liveArticles, ...articles] 
 : [...liveArticles, ...articles.filter(art => 
 art.sportName === selectedSportFromMenu || 
 art.title.toLowerCase().includes(selectedSportFromMenu.toLowerCase()) || 
 art.summary?.toLowerCase().includes(selectedSportFromMenu.toLowerCase())
 )];

    const displayArticles = combinedArticles.sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.date || Date.now()).getTime();
        const timeB = new Date(b.publishedAt || b.date || Date.now()).getTime();
        return timeB - timeA;
    }).filter((art, idx, self) => idx === self.findIndex(a => a.title.toLowerCase().trim() === art.title.toLowerCase().trim()));

 const finalDisplay = displayArticles.slice(0, 10);
 const overflowArticles = displayArticles.slice(10);

 return (
 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex items-center justify-between border-b pb-2 border-portal-border">
 <div className="flex items-center space-x-3">
 <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
 {selectedSportFromMenu === 'All' ? 'Global Sports Feed' : `${selectedSportFromMenu} Feed`}
 </h3>
 <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50 flex items-center gap-1.5">
 {isLoading ? <RefreshCw size={10} className="animate-spin" /> : <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>}
 {displayArticles.length} updates
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
 ) : finalDisplay.length === 0 ? (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 border border-dashed text-center text-xs font-mono border-portal-border text-portal-text-muted col-span-full">
 No sports intelligence available for {selectedSportFromMenu}.
 </motion.div>
 ) : (
 finalDisplay.map((art, idx) => (
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
                    setFailedImages={setFailedImages || (() => {})}
                />
            )}
 </div>
 );
}
