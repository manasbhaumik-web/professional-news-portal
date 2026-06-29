import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import GoogleNewsSection from '../components/GoogleNewsSection';
import { Flame } from 'lucide-react';

interface PoliticsPageProps {
 theme: 'dark' | 'light' | 'sepia';
 articles: NewsArticle[];
 selectedCategoryFromMenu: string;
 handleOpenArticle: (art: NewsArticle) => void;
 toggleBookmark: (id: string, e: React.MouseEvent) => void;
 bookmarks: string[];
 failedImages: string[];
 setFailedImages: (f: any) => void;
}

const POLITICS_FEEDS: Record<string, { source: string; url: string; subCategory: string }[]> = {
 All: [
 { source: 'BBC Politics', url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', subCategory: 'Global Politics' },
 { source: 'NYT Politics', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', subCategory: 'General' }
 ],
 'Global Politics': [
 { source: 'BBC Politics', url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', subCategory: 'Global Politics' }
 ],
 'Local Politics': [
 { source: 'NYT Politics', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', subCategory: 'Local Politics' }
 ],
 Elections: [
 // No direct RSS found, relying on curated feed 
 ],
 Policy: [
 // No direct RSS found, relying on curated feed
 ]
};

const POLITICS_IMAGES: Record<string, string> = {
 'Global Politics': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
 'Local Politics': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
 Elections: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
 Policy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
 All: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
 General: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'
};

export default function PoliticsPage({ articles, selectedCategoryFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages }: PoliticsPageProps) {
 const [liveArticles, setLiveArticles] = React.useState<NewsArticle[]>([]);
 const [isLoading, setIsLoading] = React.useState(false);

 React.useEffect(() => {
 const fetchCategoryFeed = async () => {
 setIsLoading(true);
 try {
 const feedsToFetch = POLITICS_FEEDS[selectedCategoryFromMenu] || [];

 const fetchPromises = feedsToFetch.map(async (feed) => {
 try {
 const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
 if (!res.ok) return [];
 const data = await res.json();
 
 if (data.status === 'ok' && data.items) {
 return data.items.map((item: any, idx: number) => ({
 id: `pol-live-${feed.source.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
 title: item.title,
 summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
 content: item.content || item.description || '',
 imageUrl: item.enclosure?.link || item.thumbnail || undefined,
 category: 'Politics',
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
 console.error('Failed to fetch live politics feed', err);
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

    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
    const nonGoogle = allSorted.filter(art => !isGoogle(art));
    const googleArticles = allSorted.filter(art => isGoogle(art));

    const displayArticles = nonGoogle.slice(0, 10);
    const overflowArticles = nonGoogle.slice(43);
    const displayGoogleArticles = googleArticles.slice(0, 40);

    return (
 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex items-center justify-between border-b pb-2 border-portal-border">
 <div className="flex items-center space-x-3">
 <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
 {selectedCategoryFromMenu === 'All' ? 'Politics & Global Policy' : `${selectedCategoryFromMenu} Feed`}
 </h3>
 <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
 {isLoading ? 'Loading...' : `${allSorted.length} indexes`}
 </span>
 </div>
 <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
 <Flame size={12} className="text-[#ef4444] animate-pulse" />
 <span className="hidden sm:inline">{selectedCategoryFromMenu === 'All' ? 'Live Political Radar' : `Live ${selectedCategoryFromMenu} Radar`}</span>
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

            {nonGoogle.length === 0 && displayGoogleArticles.length > 0 && (
                <GoogleNewsSection
                    articles={displayGoogleArticles}
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


