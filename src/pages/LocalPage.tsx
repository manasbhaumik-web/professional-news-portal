import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, CloudRain, AlertTriangle, Calendar, ChevronRight, Activity, Clock, MoreHorizontal, Globe, ThumbsUp, MessageCircle, Share2, Rss, Sun, Cloud, CloudFog, Snowflake, CloudLightning, Loader2, Map } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { NewsArticle } from '../types';
import MoreFromWire from '../components/MoreFromWire';
import CommunityMap from '../components/CommunityMap';
import GoogleNewsSection from '../components/GoogleNewsSection';

interface LocalPageProps {
 theme: 'dark' | 'light' | 'sepia';
 articles: NewsArticle[];
 handleOpenArticle: (art: NewsArticle) => void;
 toggleBookmark: (id: string, e: React.MouseEvent) => void;
 bookmarks: string[];
 failedImages: string[];
 setFailedImages: (f: any) => void;
}

import { COUNTRY_FEEDS, FALLBACK_CODES } from '../utils/countryFeeds';

export default function LocalPage({ 
 theme,
 articles,
 handleOpenArticle,
 toggleBookmark,
 bookmarks,
 failedImages,
 setFailedImages
}: LocalPageProps) {
 const isDark = theme === 'dark';
 const isSepia = theme === 'sepia';

 const [locationName, setLocationName] = useState("San Francisco, CA");
 const [countryName, setCountryName] = useState("United States");
 const [showCommunity, setShowCommunity] = useState(false);
 const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
 const [isLiveLoading, setIsLiveLoading] = useState(false);
 const [weatherData, setWeatherData] = useState<{temp: string, desc: string, iconType: string} | null>(null);
 const [alertsData, setAlertsData] = useState<{count: number, text: string}>({count: 0, text: 'No Active Alerts'});
 const [activeCategory, setActiveCategory] = useState("All");
 const [coords, setCoords] = useState<{lat: number, lon: number} | null>(null);
 const [visibleCount, setVisibleCount] = useState(10);
 const observerTarget = useRef(null);

 useEffect(() => {
 if ('geolocation' in navigator) {
 navigator.geolocation.getCurrentPosition(async (position) => {
 try {
 setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
 const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
 const data = await res.json();
 const country = data.address.country || "United States";
 const state = data.address.state || "";
 setLocationName(`${state ? `${state}, ` : ''}${country}`);
 setCountryName(country);

 const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current_weather=true&temperature_unit=fahrenheit`);
 const wData = await weatherRes.json();
 if (wData && wData.current_weather) {
     const temp = Math.round(wData.current_weather.temperature);
     const code = wData.current_weather.weathercode;
     let desc = "Clear";
     let iconType = "Sun";
     if (code >= 1 && code <= 3) { desc = "Partly Cloudy"; iconType = "Cloud"; }
     else if (code >= 45 && code <= 48) { desc = "Fog"; iconType = "CloudFog"; }
     else if (code >= 51 && code <= 67) { desc = "Rain"; iconType = "CloudRain"; }
     else if (code >= 71 && code <= 77) { desc = "Snow"; iconType = "Snowflake"; }
     else if (code >= 80 && code <= 82) { desc = "Showers"; iconType = "CloudLightning"; }
     else if (code >= 95) { desc = "Thunderstorm"; iconType = "CloudLightning"; }
     
     setWeatherData({ temp: `${temp}°F`, desc, iconType });
 }
 } catch (e) {
 console.error("Location fetch failed", e);
 }
 }, () => {
 console.error("Geolocation access denied");
 });
 }

 }, []);

 useEffect(() => {
 const fetchLocalFeed = async () => {
 setIsLiveLoading(true);
 try {
 const query = locationName === "Unknown Country" ? "Local" : locationName;
 
 let feeds = COUNTRY_FEEDS[countryName] ? [...COUNTRY_FEEDS[countryName]] : [];
 const codeParams = FALLBACK_CODES[countryName];
 
 if (feeds.length === 0) {
 // If no curated country feeds exist, fallback to Google News
 feeds.push({ 
 name: "Hyperlocal Dispatches", 
 url: `https://news.google.com/rss/search?q=${encodeURIComponent(query + " News")}` 
 });
 
 if (codeParams) {
 feeds.push({ name: `${countryName} National News`, url: `https://news.google.com/rss?hl=${codeParams}` });
 }
 }

 const fetchPromises = feeds.map(async (feed) => {
 try {
 const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
 const data = await res.json();
 if (data.status === 'ok' && data.items) {
 return data.items.map((item: any, idx: number) => ({
 id: `local-live-${feed.name.replace(/\s+/g, '')}-${idx}`,
 title: item.title,
 summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
 content: item.content || item.description || '',
 imageUrl: item.enclosure?.link || item.thumbnail || undefined,
 category: 'Local',
 sportName: feed.name, // using sportName to show source nicely if needed
 source: feed.name,
 publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
 timeAgo: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Live',
 readTime: '3 min read',
 url: item.link
 }));
 }
 return [];
 } catch (err) {
 console.error(`Failed to fetch ${feed.name}`, err);
 return [];
 }
 });

 const results = await Promise.allSettled(fetchPromises);
 let allArticles: NewsArticle[] = [];
 results.forEach(result => {
 if (result.status === 'fulfilled' && result.value.length > 0) {
 allArticles.push(...result.value);
 }
 });

 allArticles.sort(() => 0.5 - Math.random());
 setLiveArticles(allArticles.slice(0, 30));
 } catch (err) {
 console.error('Failed to fetch live local feed', err);
 } finally {
 setIsLiveLoading(false);
 }
 };

 if (locationName) {
 fetchLocalFeed();
 }
 }, [locationName, countryName]);

 const bgClass = isDark ? 'bg-[#0A0B0D]' : isSepia ? 'bg-[#FAF3E3]' : 'bg-white';
 const borderClass = isDark ? 'border-zinc-800' : isSepia ? 'border-[#CDBC9D]' : 'border-neutral-200';
 const textMutedClass = isDark ? 'text-zinc-400' : isSepia ? 'text-[#5C4D3E]' : 'text-neutral-500';
 const textPrimaryClass = isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900';
 const cardBgClass = isDark ? 'bg-[#14161B]' : isSepia ? 'bg-[#FAF6EE]' : 'bg-white';

 const combinedArticles = [...liveArticles, ...articles.filter(art => art.title.toLowerCase().includes(locationName.toLowerCase()) || art.category === 'Local')];
 const allSorted = combinedArticles.filter((art, idx, self) => idx === self.findIndex(a => a.title.toLowerCase().trim() === art.title.toLowerCase().trim()));

 const filteredByCategory = activeCategory === "All" ? allSorted : allSorted.filter(art => {
     const text = (art.title + " " + (art.summary || "") + " " + (art.content || "")).toLowerCase();
     if (activeCategory === "Local Politics") return text.includes("mayor") || text.includes("council") || text.includes("election") || text.includes("vote") || text.includes("government") || text.includes("policy");
     if (activeCategory === "Crime & Safety") return text.includes("police") || text.includes("crime") || text.includes("arrest") || text.includes("fire") || text.includes("safety") || text.includes("crash");
     if (activeCategory === "Real Estate") return text.includes("housing") || text.includes("estate") || text.includes("property") || text.includes("development") || text.includes("rent") || text.includes("market");
     if (activeCategory === "Events") return text.includes("festival") || text.includes("concert") || text.includes("event") || text.includes("market") || text.includes("community") || text.includes("weekend");
     return true;
 });

    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
    const nonGoogle = filteredByCategory.filter(art => !isGoogle(art));
    const googleArticles = filteredByCategory.filter(art => isGoogle(art));

    const mainDisplayArticles = nonGoogle.slice(0, 10);
    const overflowArticles = nonGoogle.slice(43);
    const displayGoogleArticles = googleArticles.slice(0, 40);

 const WeatherIcon = weatherData?.iconType === "Sun" ? Sun :
                     weatherData?.iconType === "Cloud" ? Cloud :
                     weatherData?.iconType === "CloudFog" ? CloudFog :
                     weatherData?.iconType === "CloudRain" ? CloudRain :
                     weatherData?.iconType === "Snowflake" ? Snowflake :
                     weatherData?.iconType === "CloudLightning" ? CloudLightning : CloudRain;

 const categories = ["All", "Local Politics", "Crime & Safety", "Real Estate", "Events"];

 return (
 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

 {/* Top Banner / Metrics */}
 <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
 <div className={`p-5 border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
 <div>
 <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Current Location</div>
 <div className={`text-xl font-serif font-black ${textPrimaryClass}`}>{locationName}</div>
 </div>
 <div className={`p-3 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
 <MapPin size={24} />
 </div>
 </div>

 <div className={`p-5 border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
 <div>
 <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Weather Conditions</div>
 <div className={`text-xl font-serif font-black ${textPrimaryClass}`}>
    {weatherData ? `${weatherData.temp} / ${weatherData.desc}` : 'Loading...'}
 </div>
 </div>
 <div className={`p-3 ${isDark ? 'bg-cyan-900/30 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
 <WeatherIcon size={24} />
 </div>
 </div>

 <div className={`p-5 border ${borderClass} ${cardBgClass} flex items-center justify-between`}>
 <div>
 <div className={`text-[10px] font-mono tracking-widest font-bold uppercase mb-1 ${textMutedClass}`}>Active Alerts</div>
 <div className={`text-xl font-serif font-black ${alertsData.count > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{alertsData.text}</div>
 </div>
 <div className={`p-3 ${alertsData.count > 0 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
 <AlertTriangle size={24} />
 </div>
 </div>
 </div>

 {/* Toggles */}
 <div className="flex items-center gap-4 pb-2 mt-4 mb-2">
 <button 
 onClick={() => setShowCommunity(false)}
 className={`px-4 py-2 font-bold font-mono text-xs uppercase tracking-wider transition-colors border ${!showCommunity ? 'bg-portal-brand text-white border-portal-brand' : `bg-portal-surface text-portal-text-muted hover:text-portal-text-main border-portal-border`}`}
 >
 <div className="flex items-center gap-2"><Rss size={14} /> Local News Feed</div>
 </button>
 <button 
 onClick={() => setShowCommunity(true)}
 className={`px-4 py-2 font-bold font-mono text-xs uppercase tracking-wider transition-colors border ${showCommunity ? 'bg-portal-brand text-white border-portal-brand' : `bg-portal-surface text-portal-text-muted hover:text-portal-text-main border-portal-border`}`}
 >
 <div className="flex items-center gap-2"><Users size={14} /> Community Intel</div>
 </button>
 </div>

 {!showCommunity && (
   <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
     {categories.map(cat => (
       <button
         key={cat}
         onClick={() => setActiveCategory(cat)}
         className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${activeCategory === cat ? 'bg-portal-text-main text-portal-bg border-portal-text-main' : `bg-portal-surface text-portal-text-muted hover:text-portal-text-main border-portal-border`}`}
       >
         {cat}
       </button>
     ))}
   </div>
 )}

 <div className="w-full">
 {!showCommunity ? (
 <div className="space-y-6">
 <div className={`p-6 border ${borderClass} ${cardBgClass}`}>
 <div className="relative z-10 flex items-center justify-between mb-6">
 <h3 className={`font-serif font-black text-2xl flex items-center gap-2 ${textPrimaryClass}`}>
 <Rss className="text-portal-brand" /> Free News Feeds - {locationName}
 </h3>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
 {isLiveLoading && mainDisplayArticles.length === 0 ? (
   Array.from({ length: 4 }).map((_, i) => (
     <div key={i} className={`p-5 border ${borderClass} ${cardBgClass} flex flex-col sm:flex-row gap-5 animate-pulse`}>
       <div className={`w-full sm:w-36 h-28 shrink-0 bg-neutral-200 dark:bg-zinc-800`}></div>
       <div className="flex-1 space-y-4 py-2 w-full">
         <div className={`h-4 w-1/4 rounded bg-neutral-200 dark:bg-zinc-800`}></div>
         <div className={`h-5 w-full rounded bg-neutral-200 dark:bg-zinc-800`}></div>
         <div className={`h-4 w-3/4 rounded bg-neutral-200 dark:bg-zinc-800`}></div>
       </div>
     </div>
   ))
 ) : (
  mainDisplayArticles.map((art, idx) => (
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
                <div className="mt-8">
                    <MoreFromWire 
                        articles={overflowArticles} 
                        handleOpenArticle={handleOpenArticle}
                        toggleBookmark={toggleBookmark}
                        bookmarks={bookmarks}
                        failedImages={failedImages || []}
                        setFailedImages={setFailedImages || (() => {})}
                    />
                </div>
            )}

            {nonGoogle.length === 0 && displayGoogleArticles.length > 0 && (
                <div className="mt-8">
                    <GoogleNewsSection
                        articles={displayGoogleArticles}
                        handleOpenArticle={handleOpenArticle}
                        toggleBookmark={toggleBookmark}
                        bookmarks={bookmarks}
                        failedImages={failedImages || []}
                        setFailedImages={setFailedImages || (() => {})}
                    />
                </div>
            )}
         </div>
     </div>
 ) : (
     <div className="space-y-6">
         <div className={`p-6 border ${borderClass} ${cardBgClass}`}>
             <h3 className={`font-serif font-black text-2xl flex items-center gap-2 mb-6 ${textPrimaryClass}`}>
                 <Globe className="text-portal-brand" /> Interactive Community Map
             </h3>
             {coords ? (
                 <CommunityMap lat={coords.lat} lon={coords.lon} />
             ) : (
                 <div className="h-[600px] flex items-center justify-center border border-dashed border-portal-border bg-portal-bg/50">
                     <span className={`${textMutedClass}`}>Awaiting location data...</span>
                 </div>
             )}
         </div>
     </div>
 )}
 </div>
 </div>
 );
}


