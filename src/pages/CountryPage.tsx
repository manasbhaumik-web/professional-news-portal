import React, { useState, useEffect } from 'react';
import { Globe2, Search, Rss, AlertCircle, Users, Map, Cloud, Clock } from 'lucide-react';
import { NewsArticle } from '../types';
import ArticleCard from '../components/ArticleCard';
import MoreFromWire from '../components/MoreFromWire';
import GoogleNewsSection from '../components/GoogleNewsSection';
import { COUNTRY_FEEDS, FALLBACK_CODES } from '../utils/countryFeeds';

interface CountryPageProps {
    theme: 'dark' | 'light' | 'sepia';
    handleOpenArticle: (art: NewsArticle) => void;
    toggleBookmark: (id: string, e: React.MouseEvent) => void;
    bookmarks: string[];
    failedImages: string[];
    setFailedImages: (f: any) => void;
    selectedCountry: string;
}



export default function CountryPage({
    theme,
    handleOpenArticle,
    toggleBookmark,
    bookmarks,
    failedImages,
    setFailedImages,
    selectedCountry
}: CountryPageProps) {
    const isDark = theme === 'dark';
    const isSepia = theme === 'sepia';

    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [countryFlagUrl, setCountryFlagUrl] = useState<string>('');
    const [countryMeta, setCountryMeta] = useState<{
        population?: string;
        region?: string;
        time?: string;
        weather?: string;
    } | null>(null);

    const bgClass = isDark ? 'bg-[#0A0B0D]' : isSepia ? 'bg-[#FAF3E3]' : 'bg-white';
    const borderClass = isDark ? 'border-zinc-800' : isSepia ? 'border-[#CDBC9D]' : 'border-neutral-200';
    const textMutedClass = isDark ? 'text-zinc-400' : isSepia ? 'text-[#5C4D3E]' : 'text-neutral-500';
    const textPrimaryClass = isDark ? 'text-white' : isSepia ? 'text-[#2C2114]' : 'text-neutral-900';
    const cardBgClass = isDark ? 'bg-[#14161B]' : isSepia ? 'bg-[#FAF6EE]' : 'bg-white';

    const fetchCountryNews = async (country: string) => {
        setIsLoading(true);
        setArticles([]);

        // Hardcode common flags to bypass any API blocking
        const flagMap: Record<string, string> = {
            "India": "in", "United States": "us", "United Kingdom": "gb", "Canada": "ca", "Australia": "au",
            "China": "cn", "Japan": "jp", "Malaysia": "my", "South Africa": "za", "France": "fr", "Germany": "de",
            "Georgia": "ge", "Argentina": "ar", "Brazil": "br", "Indonesia": "id", "Italy": "it", "Mexico": "mx",
            "Nigeria": "ng", "Russia": "ru", "Saudi Arabia": "sa", "South Korea": "kr", "Spain": "es", "Turkey": "tr",
            "Switzerland": "ch", "Portugal": "pt", "Singapore": "sg", "New Zealand": "nz", "Netherlands": "nl"
        };

        setCountryMeta(null);

        if (flagMap[country]) {
            setCountryFlagUrl(`https://flagcdn.com/${flagMap[country]}.svg`);
        }

        try {
            const metaRes = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=flags,population,region,timezones,latlng`);
            if (!metaRes.ok) throw new Error("REST Countries API failed");
            const metaData = await metaRes.json();
            if (metaData && Array.isArray(metaData) && metaData.length > 0) {
                const data = metaData[0];

                if (!flagMap[country]) {
                    if (data.flags?.svg || data.flags?.png) {
                        setCountryFlagUrl(data.flags.svg || data.flags.png);
                    } else {
                        setCountryFlagUrl('');
                    }
                }

                let timeStr = '';
                if (data.timezones && data.timezones.length > 0) {
                    const tz = data.timezones[0];
                    if (tz === "UTC") {
                        timeStr = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
                    } else if (tz.startsWith("UTC")) {
                        const offset = tz.replace("UTC", "");
                        const sign = offset.startsWith('-') ? -1 : 1;
                        const parts = offset.substring(1).split(':');
                        const hours = parseInt(parts[0], 10) || 0;
                        const minutes = parseInt(parts[1], 10) || 0;
                        const totalOffsetMins = sign * (hours * 60 + minutes);

                        const now = new Date();
                        const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000);
                        const localTime = new Date(utcNow + (totalOffsetMins * 60000));
                        timeStr = localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    }
                }

                setCountryMeta(prev => ({
                    ...(prev || {}),
                    population: data.population ? new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(data.population) : undefined,
                    region: data.region,
                    time: timeStr
                }));

                // Fetch weather using lat/lng via open-meteo
                if (data.latlng && data.latlng.length === 2) {
                    try {
                        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.latlng[0]}&longitude=${data.latlng[1]}&current_weather=true`);
                        if (weatherRes.ok) {
                            const weatherData = await weatherRes.json();
                            const temp = weatherData.current_weather?.temperature;
                            if (temp !== undefined) {
                                setCountryMeta(prev => ({ ...(prev || {}), weather: `${temp}°C` }));
                            }
                        }
                    } catch (we) {
                        console.log("Open-meteo fetch failed", we);
                    }
                }

            } else if (!flagMap[country]) {
                setCountryFlagUrl('');
            }
        } catch (e) {
            if (!flagMap[country]) setCountryFlagUrl('');
        }

        try {
            let feeds = COUNTRY_FEEDS[country];

            if (!feeds) {
                // Fallback to just Google News if no multi-feed config exists for this country
                const codeParams = FALLBACK_CODES[country];
                const rssUrlStr = codeParams
                    ? `https://news.google.com/rss?hl=${codeParams}`
                    : `https://news.google.com/rss/search?q=${encodeURIComponent(country + " Local News")}`;
                feeds = [{ name: "Google News Feed", url: rssUrlStr }];
            }

            const fetchPromises = feeds.map(async (feed) => {
                try {
                    const res = await fetch(`/api/news/proxy?url=${encodeURIComponent(feed.url)}`);
                    const data = await res.json();
                    if (data.status === 'ok' && data.items) {
                        return data.items.map((item: any, idx: number) => ({
                            id: `country-${country}-${feed.name.replace(/\s+/g, '')}-${idx}-${Date.now()}`,
                            title: (item.title || '').replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim(),
                            summary: item.description ? item.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : '',
                            content: item.content || item.description || '',
                            imageUrl: item.enclosure?.link || item.thumbnail || undefined,
                            category: 'Country',
                            sportName: country,
                            source: feed.name,
                            publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                            timeAgo: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
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

            // Shuffle articles to mix sources
            allArticles.sort(() => 0.5 - Math.random());
            setArticles(allArticles.filter((art, idx, self) => idx === self.findIndex(a => a.title.toLowerCase().trim() === art.title.toLowerCase().trim())).slice(0, 50)); // Cap to 50 items for performance

        } catch (err) {
            console.error('Failed to fetch country feed', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountryNews(selectedCountry);
    }, [selectedCountry]);

    const isGoogle = (art: NewsArticle) => art.source?.toLowerCase().includes('google') || art.url?.includes('news.google.com');
    const nonGoogle = articles.filter(art => !isGoogle(art));
    const googleArticles = articles.filter(art => isGoogle(art));

    const displayArticles = nonGoogle.slice(0, 10);
    const overflowArticles = nonGoogle.slice(43);
    const displayGoogleArticles = googleArticles.slice(0, 40);


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Banner removed as per user request */}

            {/* News Feed */}
            <div className="flex items-center justify-between border-b pb-2 border-portal-border">
                <div className="flex items-center space-x-3">
                    <h3 className="font-serif font-black text-lg sm:text-xl tracking-tight capitalize text-portal-text-main">
                        {selectedCountry} Feed
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase bg-portal-surface text-portal-text-muted border border-portal-border/50">
                        {isLoading ? 'Loading...' : `${articles.length} updates`}
                    </span>
                </div>
                <div className="text-xs flex items-center space-x-1 select-none font-mono text-portal-text-muted">
                    <Globe2 size={12} className="text-blue-500 animate-pulse" />
                    <span className="hidden sm:inline">Live {selectedCountry} Radar</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto">
                    {isLoading ? (
                        <div className={`col-span-full p-12 text-center border border-dashed ${borderClass} ${textMutedClass} font-mono text-xs flex flex-col items-center justify-center gap-3`}>
                            <Rss size={24} className="animate-pulse text-portal-brand" />
                            Fetching dispatches from {selectedCountry}...
                        </div>
                    ) : articles.length === 0 ? (
                        <div className={`col-span-full p-12 text-center border border-dashed ${borderClass} ${textMutedClass} font-mono text-xs flex flex-col items-center justify-center gap-3`}>
                            <AlertCircle size={24} className="opacity-50" />
                            Sorry !! Nothing to display in this section at the moment
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
