import React from 'react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import { Sparkles } from 'lucide-react';

interface EntertainmentPageProps {
 theme: 'dark' | 'light' | 'sepia';
 articles: NewsArticle[];
 selectedCategoryFromMenu: string;
 handleOpenArticle: (art: NewsArticle) => void;
 toggleBookmark: (id: string, e: React.MouseEvent) => void;
 bookmarks: string[];
 failedImages?: string[];
 setFailedImages?: (f: any) => void;
}

export default function EntertainmentPage({ articles, selectedCategoryFromMenu, handleOpenArticle, toggleBookmark, bookmarks, failedImages, setFailedImages }: EntertainmentPageProps) {
 const [liveArticles, setLiveArticles] = React.useState<NewsArticle[]>([]);
 const [isLoading, setIsLoading] = React.useState(false);

 React.useEffect(() => {
    const fetchCategoryFeeds = async () => {
      setIsLoading(true);
      try {
        const categoryFeeds: Record<string, {name: string, url: string}[]> = {
          'All': [
            { name: 'Google News', url: 'https://news.google.com/rss/search?q=Entertainment' },
            { name: 'TMZ', url: 'https://www.tmz.com/rss.xml' },
            { name: 'Variety', url: 'https://variety.com/feed/' },
            { name: 'E! News', url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml' },
            { name: 'Deadline', url: 'https://deadline.com/feed/' }
          ],
          'Movies': [
            { name: 'Google News', url: 'https://news.google.com/rss/search?q=Movies+Film' },
            { name: 'Variety Film', url: 'https://variety.com/v/film/feed/' },
            { name: 'Deadline Film', url: 'https://deadline.com/v/film/feed/' },
            { name: 'IndieWire Film', url: 'https://www.indiewire.com/v/film/feed/' }
          ],
          'Music': [
            { name: 'Google News', url: 'https://news.google.com/rss/search?q=Music' },
            { name: 'Billboard', url: 'https://www.billboard.com/feed/' },
            { name: 'Rolling Stone', url: 'https://www.rollingstone.com/feed/' },
            { name: 'Pitchfork', url: 'https://pitchfork.com/rss/news/' }
          ],
          'Television': [
            { name: 'Google News', url: 'https://news.google.com/rss/search?q=Television+TV+Shows' },
            { name: 'Variety TV', url: 'https://variety.com/v/tv/feed/' },
            { name: 'Deadline TV', url: 'https://deadline.com/v/tv/feed/' },
            { name: 'TVLine', url: 'https://tvline.com/feed/' }
          ],
          'Celebrity': [
            { name: 'Google News', url: 'https://news.google.com/rss/search?q=Celebrity+Gossip' },
            { name: 'TMZ', url: 'https://www.tmz.com/rss.xml' },
            { name: 'E! News', url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml' },
            { name: 'People', url: 'https://people.com/feed/' }
          ]
        };

        const feeds = categoryFeeds[selectedCategoryFromMenu] || categoryFeeds['All'];

        const allMapped: NewsArticle[] = [];
        
        await Promise.allSettled(
          feeds.map(async (feed, fIdx) => {
            try {
              const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
              const data = await res.json();
              if (data.status === 'ok' && data.items) {
                const mapped: NewsArticle[] = data.items.map((item: any, idx: number) => ({
                  id: `ent-live-${fIdx}-${idx}`,
                  title: item.title,
                  summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
                  content: item.content || item.description || '',
                  imageUrl: item.enclosure?.link || item.thumbnail || undefined,
                  category: 'Entertainment',
                  sportName: selectedCategoryFromMenu,
                  source: feed.name,
                  publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                  timeAgo: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Live',
                  readTime: '3 min read',
                  url: item.link
                }));
                allMapped.push(...mapped.slice(0, 10)); // Top 10 from each feed
              }
            } catch (err) {
              console.error(`Failed to fetch ${feed.name}`, err);
            }
          })
        );
        
        allMapped.sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
        setLiveArticles(allMapped);
      } catch (err) {
        console.error('Failed to fetch live entertainment feeds', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryFeeds();
 }, [selectedCategoryFromMenu]);

 const combinedArticles = selectedCategoryFromMenu === 'All' 
 ? [...liveArticles, ...articles] 
 : [...liveArticles, ...articles.filter(art => 
 (art.title || '').toLowerCase().includes(selectedCategoryFromMenu.toLowerCase()) || 
 (art.summary || '').toLowerCase().includes(selectedCategoryFromMenu.toLowerCase())
 )];

 const allSorted = combinedArticles.sort((a, b) => {
 const timeA = new Date(a.publishedAt || a.date || Date.now()).getTime();
 const timeB = new Date(b.publishedAt || b.date || Date.now()).getTime();
 return timeB - timeA;
 }).filter((art, idx, self) => idx === self.findIndex(a => (a.title || '').toLowerCase().trim() === (art.title || '').toLowerCase().trim()));

 const displayArticles = allSorted.slice(0, 10);
 const overflowArticles = allSorted.slice(10);

 return (
 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="flex items-center justify-between border-b pb-2 border-portal-border">
 <div className="flex items-center space-x-3">
 <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
 {selectedCategoryFromMenu === 'All' ? 'Entertainment & Culture' : `${selectedCategoryFromMenu} Feed`}
 </h3>
 <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
 {isLoading ? 'Loading...' : `${allSorted.length} updates`}
 </span>
 </div>
 <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
 <Sparkles size={12} className="text-fuchsia-500" />
 <span className="hidden sm:inline">{selectedCategoryFromMenu === 'All' ? 'Live Culture Feed' : `Live ${selectedCategoryFromMenu} Radar`}</span>
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
