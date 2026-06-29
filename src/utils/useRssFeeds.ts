import { useCallback } from 'react';

export interface FeedConfig {
    name?: string; // used in FIFA
    source?: string; // used in Sports
    url: string;
    sportName?: string;
    flag?: string;
}

export interface CachedFeedResult {
    data: any;
    timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Global caches outside the hook so they persist across component mounts
const globalFeedCache = new Map<string, CachedFeedResult>();
const inFlightRequests = new Map<string, Promise<any>>();

export function useRssFeeds() {
    const fetchFeeds = useCallback(async (feeds: FeedConfig[]) => {
        const results: any[] = [];
        const successSources: string[] = [];

        const promises = feeds.map(async (feed) => {
            const now = Date.now();
            const sourceName = feed.source || feed.name || 'Unknown';
            // We use the raw target url as the cache key to deduplicate even if one uses /api/news/proxy?url=... and the other doesn't
            let cacheKey = feed.url;
            if (feed.url.includes('/api/news/proxy?url=')) {
                cacheKey = decodeURIComponent(feed.url.split('url=')[1]);
            }

            const cached = globalFeedCache.get(cacheKey);

            if (cached && now - cached.timestamp < CACHE_TTL) {
                if (cached.data && cached.data.status === 'ok') {
                    results.push({ ...cached.data, feedConfig: feed });
                    successSources.push(sourceName);
                }
                return;
            }

            let requestPromise = inFlightRequests.get(cacheKey);
            if (!requestPromise) {
                // If not fetching, start a new fetch
                const urlToFetch = feed.url.startsWith('/api/') ? feed.url : '/api/news/proxy?url=' + encodeURIComponent(feed.url);
                requestPromise = fetch(urlToFetch).then(res => res.json()).catch(() => null);
                inFlightRequests.set(cacheKey, requestPromise);
            }

            try {
                const data = await requestPromise;
                if (data) {
                    globalFeedCache.set(cacheKey, { data, timestamp: Date.now() });
                    if (data.status === 'ok') {
                        results.push({ ...data, feedConfig: feed });
                        successSources.push(sourceName);
                    }
                }
            } catch (err) {
                // Silently fail for individual feeds
            } finally {
                // Only delete if it's the same promise (in case of race conditions)
                if (inFlightRequests.get(cacheKey) === requestPromise) {
                    inFlightRequests.delete(cacheKey);
                }
            }
        });

        await Promise.allSettled(promises);
        return { results, successSources };
    }, []);

    return { fetchFeeds };
}
