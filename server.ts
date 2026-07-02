import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { getTopNews, getBreakingNews } from "./src/utils/ranking";
dotenv.config();

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['yt:videoId', 'ytVideoId'],
      ['media:group', 'mediaGroup'],
      ['content:encoded', 'contentEncoded'],
      ['image', 'image'],
      ['thumbnail', 'thumbnail']
    ]
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// High-quality baseline articles database (simulating a database)
const INITIAL_BASE_ARTICLES: any[] = [];

import fs from "fs";
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const articlesFile = path.join(dataDir, "articles.json");

let BASE_ARTICLES = [];
if (fs.existsSync(articlesFile)) {
  try {
    BASE_ARTICLES = JSON.parse(fs.readFileSync(articlesFile, "utf-8"));
  } catch (err) {
    console.error("Failed to parse articles.json", err);
    BASE_ARTICLES = INITIAL_BASE_ARTICLES;
  }
} else {
  BASE_ARTICLES = INITIAL_BASE_ARTICLES;
  fs.writeFileSync(articlesFile, JSON.stringify(BASE_ARTICLES, null, 2));
}

const feedsFile = path.join(dataDir, "feeds.json");
let ACTIVE_FEEDS: any[] = [];
if (fs.existsSync(feedsFile)) {
  try {
    ACTIVE_FEEDS = JSON.parse(fs.readFileSync(feedsFile, "utf-8"));
  } catch (err) {
    ACTIVE_FEEDS = [];
  }
} else {
  ACTIVE_FEEDS = [];
  fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
}

// Cache of dynamically generated news to preserve user session
let sessionPersonalizedNews: {
  briefing: string;
  articles: any[];
} | null = null;

// RSS Feed caching
let cachedNews: any[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// CMS Routes
const ADMIN_PASSWORD = "admin123";

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization;
  if (token === `Bearer ${ADMIN_PASSWORD}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

app.post('/api/cms/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

app.get('/api/cms/articles', authMiddleware, (req, res) => {
  res.json(BASE_ARTICLES);
});

app.post('/api/cms/articles', authMiddleware, (req, res) => {
  const newArticle = { ...req.body, id: `art-${Date.now()}` };
  BASE_ARTICLES.unshift(newArticle);
  fs.writeFileSync(articlesFile, JSON.stringify(BASE_ARTICLES, null, 2));
  res.json(newArticle);
});

app.get('/api/cms/feeds', authMiddleware, (req, res) => {
  res.json(ACTIVE_FEEDS);
});

app.post('/api/cms/feeds', authMiddleware, (req, res) => {
  const newFeed = { ...req.body, id: `feed-${Date.now()}` };
  ACTIVE_FEEDS.push(newFeed);
  fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
  cachedNews = []; // invalidate cache
  res.json(newFeed);
});

app.put('/api/cms/feeds/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const index = ACTIVE_FEEDS.findIndex(f => f.id === id);
  if (index !== -1) {
    ACTIVE_FEEDS[index] = { ...ACTIVE_FEEDS[index], ...req.body };
    fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
    cachedNews = [];
    res.json(ACTIVE_FEEDS[index]);
  } else {
    res.status(404).json({ error: "Feed not found" });
  }
});

const configFile = path.join(dataDir, "config.json");
const INITIAL_CONFIG = {
  siteTitle: "The Horizon Post Online",
  footerText: "© 2026 THE HORIZON POST INC",
  defaultTheme: "dark"
};
let GLOBAL_CONFIG = { ...INITIAL_CONFIG };
if (fs.existsSync(configFile)) {
  try {
    GLOBAL_CONFIG = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  } catch (err) {
    GLOBAL_CONFIG = { ...INITIAL_CONFIG };
  }
} else {
  fs.writeFileSync(configFile, JSON.stringify(GLOBAL_CONFIG, null, 2));
}

app.get('/api/config', (req, res) => {
  res.json(GLOBAL_CONFIG);
});

app.put('/api/cms/config', authMiddleware, (req, res) => {
  GLOBAL_CONFIG = { ...GLOBAL_CONFIG, ...req.body };
  fs.writeFileSync(configFile, JSON.stringify(GLOBAL_CONFIG, null, 2));
  res.json(GLOBAL_CONFIG);
});

app.delete('/api/cms/feeds/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  ACTIVE_FEEDS = ACTIVE_FEEDS.filter(f => f.id !== id);
  fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
  cachedNews = [];
  res.json({ success: true });
});

app.put('/api/cms/articles/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const index = BASE_ARTICLES.findIndex(a => a.id === id);
  if (index !== -1) {
    BASE_ARTICLES[index] = { ...BASE_ARTICLES[index], ...req.body };
    fs.writeFileSync(articlesFile, JSON.stringify(BASE_ARTICLES, null, 2));
    res.json(BASE_ARTICLES[index]);
  } else {
    res.status(404).json({ error: "Article not found" });
  }
});

app.delete('/api/cms/articles/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  BASE_ARTICLES = BASE_ARTICLES.filter(a => a.id !== id);
  fs.writeFileSync(articlesFile, JSON.stringify(BASE_ARTICLES, null, 2));
  res.json({ success: true });
});

app.get('/api/news/proxy', async (req, res) => {
  try {
    const rssUrl = req.query.url as string;
    if (!rssUrl) return res.status(400).json({ status: 'error', message: 'Missing url param' });

    const feed = await parser.parseURL(rssUrl);
    res.json({
      status: 'ok',
      items: feed.items
        .filter((item: any) => item.pubDate && !isNaN(new Date(item.pubDate).getTime()))
        .map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: item.contentSnippet || item.content || item.summary || '',
          content: item.content || item['content:encoded'] || '',
          author: item.creator || item.author || '',
          enclosure: item.enclosure ? { link: item.enclosure.url } : null,
          thumbnail: item.mediaContent?.$?.url || item.mediaThumbnail?.$?.url || item.image?.$?.url || item.thumbnail?.$?.url || ''
        }))
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to parse feed' });
  }
});

async function fetchRealTimeNews() {
  if (Date.now() - lastFetchTime < CACHE_TTL && cachedNews.length > 0) {
    return cachedNews;
  }

  const INITIAL_FEEDS = [
    // North America
    { url: 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', category: 'North America' },
    { url: 'https://feeds.npr.org/1001/rss.xml', category: 'North America' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml', category: 'North America' },
    { url: 'https://www.cbc.ca/cmlink/rss-topstories', category: 'North America' },

    // Latin America
    { url: 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', category: 'Latin America' },
    { url: 'https://en.mercopress.com/rss', category: 'Latin America' },

    // Europe
    { url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml', category: 'Europe' },
    { url: 'https://rss.dw.com/rdf/rss-en-eu', category: 'Europe' },
    { url: 'https://www.france24.com/en/europe/rss', category: 'Europe' },

    // Arab / Middle East
    { url: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', category: 'Arab' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'Arab' },
    { url: 'https://gulfnews.com/rss/region', category: 'Arab' },

    // Sub-Saharan Africa
    { url: 'http://feeds.bbci.co.uk/news/world/africa/rss.xml', category: 'Sub-Saharan Africa' },
    { url: 'http://feeds.news24.com/articles/news24/Africa/rss', category: 'Sub-Saharan Africa' },

    // South Asia
    { url: 'http://feeds.bbci.co.uk/news/world/asia/india/rss.xml', category: 'South Asia' },
    { url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'South Asia' },
    { url: 'https://www.dawn.com/feeds/home/', category: 'South Asia' },

    // South East Asia
    { url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?expand=each', category: 'South East Asia' },
    { url: 'https://www.thestar.com.my/rss/News', category: 'South East Asia' },
    { url: 'https://www.bangkokpost.com/rss/data/topstories.xml', category: 'South East Asia' },

    // East Asia
    { url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml', category: 'East Asia' },
    { url: 'https://www.scmp.com/rss/2/feed', category: 'East Asia' },
    { url: 'https://www.japantimes.co.jp/news/feed/', category: 'East Asia' },
    { url: 'https://news.abs-cbn.com/rss/world', category: 'South East Asia' },
    { url: 'https://www.rnz.co.nz/rss/world.xml', category: 'Oceania' },
    { url: 'https://www.abc.net.au/news/feed/51120/rss.xml', category: 'Oceania' },

    // Global Sports
    { url: 'http://feeds.bbci.co.uk/sport/football/rss.xml', category: 'Sports', sportName: 'Football' },
    { url: 'https://www.espn.com/espn/rss/soccer/news', category: 'Sports', sportName: 'Football' },
    { url: 'http://feeds.bbci.co.uk/sport/tennis/rss.xml', category: 'Sports', sportName: 'Tennis' },
    { url: 'http://feeds.bbci.co.uk/sport/cricket/rss.xml', category: 'Sports', sportName: 'Cricket' },

    // Additional Sports
    { url: 'https://www.skysports.com/rss/12138', category: 'Sports', sportName: 'Golf' },
    { url: 'http://feeds.bbci.co.uk/sport/golf/rss.xml', category: 'Sports', sportName: 'Golf' },
    { url: 'https://www.skysports.com/rss/12183', category: 'Sports', sportName: 'Boxing/MMA' },
    { url: 'https://sports.yahoo.com/mma/rss.xml', category: 'Sports', sportName: 'Boxing/MMA' },
    { url: 'https://www.skysports.com/rss/12056', category: 'Sports', sportName: 'Rugby' },
    { url: 'http://feeds.bbci.co.uk/sport/rugby-union/rss.xml', category: 'Sports', sportName: 'Rugby' },
    { url: 'http://feeds.bbci.co.uk/sport/athletics/rss.xml', category: 'Sports', sportName: 'Athletics' },
    { url: 'http://feeds.bbci.co.uk/sport/cycling/rss.xml', category: 'Sports', sportName: 'Cycling' },

    // Politics
    { url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', category: 'Politics' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics' },

    // Business & Finance
    { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'Business' },
    { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?id=10000664', category: 'Business' },

    // Entertainment (Movie, Music)
    { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml', category: 'Entertainment' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Music.xml', category: 'Entertainment' },

    // Science & Tech
    { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
    { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', category: 'Technology' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Space.xml', category: 'Space' }
  ].map(f => ({ ...f, id: `feed-${Math.random().toString(36).substring(2, 9)}`, enabled: true }));

  const feedsFile = path.join(dataDir, "feeds.json");
  let ACTIVE_FEEDS: any[] = [];
  if (fs.existsSync(feedsFile)) {
    try {
      ACTIVE_FEEDS = JSON.parse(fs.readFileSync(feedsFile, "utf-8"));
    } catch (err) {
      ACTIVE_FEEDS = INITIAL_FEEDS;
    }
  } else {
    ACTIVE_FEEDS = INITIAL_FEEDS;
    fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
  }

  // Ensure dedicated breaking news feeds are injected
  if (!ACTIVE_FEEDS.some(f => f.category === 'Breaking News')) {
    ACTIVE_FEEDS.push(
      { url: 'https://abcnews.go.com/abcnews/topstories', category: 'Breaking News', id: `feed-break-1`, enabled: true },
      { url: 'http://rss.cnn.com/rss/cnn_latest.rss', category: 'Breaking News', id: `feed-break-2`, enabled: true }
    );
    fs.writeFileSync(feedsFile, JSON.stringify(ACTIVE_FEEDS, null, 2));
  }

  const feeds = ACTIVE_FEEDS.filter(f => f.enabled !== false);

  let realTimeArticles: any[] = [];

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>?/gm, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#147;/g, '"')
      .replace(/&#148;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  const fetchPromises = feeds.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      const sliceCount = 10;
      return parsed.items
        .filter((item: any) => item.pubDate && !isNaN(new Date(item.pubDate).getTime()))
        .slice(0, sliceCount).map((item: any, idx) => {
          let originalImage = null;

          const isImageUrl = (url: string) => url && /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(url);

          if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
            originalImage = item.mediaContent.$.url;
          } else if (item.mediaContent && typeof item.mediaContent === 'string' && isImageUrl(item.mediaContent)) {
            originalImage = item.mediaContent;
          } else if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
            originalImage = item.mediaThumbnail.$.url;
          } else if (item.mediaThumbnail && typeof item.mediaThumbnail === 'string' && isImageUrl(item.mediaThumbnail)) {
            originalImage = item.mediaThumbnail;
          } else if (item.mediaGroup && item.mediaGroup.mediaContent && item.mediaGroup.mediaContent[0] && item.mediaGroup.mediaContent[0].$ && item.mediaGroup.mediaContent[0].$.url) {
            originalImage = item.mediaGroup.mediaContent[0].$.url;
          } else if (item.enclosure && item.enclosure.url && ((item.enclosure.type && item.enclosure.type.startsWith('image/')) || isImageUrl(item.enclosure.url))) {
            originalImage = item.enclosure.url;
          } else if (item.image && item.image.url) {
            originalImage = item.image.url;
          } else if (item.image && typeof item.image === 'string' && isImageUrl(item.image)) {
            originalImage = item.image;
          } else if (item.thumbnail && typeof item.thumbnail === 'string' && isImageUrl(item.thumbnail)) {
            originalImage = item.thumbnail;
          } else if (item.contentEncoded || item.content) {
            const htmlContent = item.contentEncoded || item.content;
            const imgMatch = htmlContent.match(/<img[^>]+src=["']([^"'>]+)["']/i);
            if (imgMatch && imgMatch[1]) {
              originalImage = imgMatch[1];
            } else {
              // Video Thumbnail Fallbacks
              const ytMatch = htmlContent.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
              if (ytMatch && ytMatch[1]) {
                originalImage = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
              } else {
                const videoPosterMatch = htmlContent.match(/<video[^>]+poster=["']([^"'>]+)["']/i);
                if (videoPosterMatch && videoPosterMatch[1]) {
                  originalImage = videoPosterMatch[1];
                }
              }
            }
          }

          if (!originalImage && item.link) {
            const ytLinkMatch = item.link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
            if (ytLinkMatch && ytLinkMatch[1]) {
              originalImage = `https://img.youtube.com/vi/${ytLinkMatch[1]}/hqdefault.jpg`;
            }
          }

          // Region-specific high quality fallback images
          const regionImages: Record<string, string[]> = {
            'North America': [
              "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80"
            ],
            'Europe': [
              "https://images.unsplash.com/photo-1513635269975-59693e0cd156?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
            ],
            'Arab': [
              "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1542051812-f47025fb3e1a?auto=format&fit=crop&w=800&q=80"
            ],
            'East Asia': [
              "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80"
            ],
            'Latin America': [
              "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80"
            ],
            'South Asia': [
              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80"
            ],
            'South East Asia': [
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80"
            ],
            'Sub-Saharan Africa': [
              "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80"
            ],
            'Oceania': [
              "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80"
            ],
            'Sports': [
              "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
            ],
            'Politics': [
              "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=800&q=80"
            ],
            'Business': [
              "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1611974789855-9c2a0a2236a0?auto=format&fit=crop&w=800&q=80"
            ],
            'Entertainment': [
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
            ],
            'Science': [
              "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
            ],
            'Technology': [
              "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
            ],
            'Space': [
              "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
            ]
          };

          const imagePool = regionImages[feed.category] || [
            "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80"
          ];

          return {
            id: `rss-${feed.category.toLowerCase().replace(/\s+/g, '-')}-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: item.title || "No Title",
            category: feed.category,
            summary: stripHtml(item.contentSnippet || item.content || "No summary available."),
            content: stripHtml(item.content || item.contentSnippet || "No detailed content available."),
            source: parsed.title || "Global Network",
            date: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just Now",
            publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            readTime: "3 min read",
            imageUrl: originalImage || null,
            trendsUp: Math.random() > 0.5,
            views: Math.floor(Math.random() * 8000) + 1200,
            isAiGenerated: false,
            originalUrl: item.link || undefined,
            sportName: (feed as any).sportName
          };
        });
    } catch (err) {
      console.error(`Error fetching RSS feed ${feed.url}:`, err);
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);

  results.forEach(result => {
    if (result.status === 'fulfilled') {
      realTimeArticles.push(...result.value);
    }
  });

  // Fallback for empty categories
  const REQUIRED_CATEGORIES = [
    'North America', 'Latin America', 'Europe', 'Arab', 'Sub-Saharan Africa',
    'South Asia', 'South East Asia', 'East Asia', 'Oceania',
    'Sports', 'Politics', 'Business', 'Entertainment', 'Science', 'Technology', 'Space'
  ];

  const fetchedCategories = new Set(realTimeArticles.map(a => a.category));
  const fallbackPromises: Promise<any>[] = [];

  for (const category of REQUIRED_CATEGORIES) {
    if (!fetchedCategories.has(category)) {
      const query = category === 'Arab' ? 'Middle East' : category;
      const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}+news&hl=en-US&gl=US&ceid=US:en`;

      const fallbackPromise = parser.parseURL(rssUrl).then(parsed => {
        return parsed.items
          .filter((item: any) => item.pubDate && !isNaN(new Date(item.pubDate).getTime()))
          .slice(0, 15).map((item: any, idx) => {
            let originalImage = null;
            const isImageUrl = (url: string) => url && /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(url);

            if (item.enclosure && isImageUrl(item.enclosure.url)) originalImage = item.enclosure.url;
            else if (item.mediaContent && item.mediaContent.$ && isImageUrl(item.mediaContent.$.url)) originalImage = item.mediaContent.$.url;
            else if (item.mediaThumbnail && item.mediaThumbnail.$ && isImageUrl(item.mediaThumbnail.$.url)) originalImage = item.mediaThumbnail.$.url;
            else if (item.image && item.image.$ && isImageUrl(item.image.$.url)) originalImage = item.image.$.url;
            else if (item.thumbnail && item.thumbnail.$ && isImageUrl(item.thumbnail.$.url)) originalImage = item.thumbnail.$.url;

            return {
              id: `fallback-${category.toLowerCase().replace(/\s+/g, '-')}-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: item.title || "No Title",
              category: category,
              summary: stripHtml(item.contentSnippet || item.content || "No summary available."),
              content: stripHtml(item.content || item.contentSnippet || "No detailed content available."),
              source: parsed.title || "Google News Fallback",
              date: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just Now",
              publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
              readTime: "3 min read",
              imageUrl: originalImage || null, // UI handles fallbacks
              trendsUp: Math.random() > 0.5,
              views: Math.floor(Math.random() * 8000) + 1200,
              isAiGenerated: false,
              originalUrl: item.link || undefined
            };
          });
      }).catch(err => {
        console.error(`Error fetching fallback for ${category}:`, err);
        return [];
      });
      fallbackPromises.push(fallbackPromise);
    }
  }

  const fallbackResults = await Promise.allSettled(fallbackPromises);
  fallbackResults.forEach(result => {
    if (result.status === 'fulfilled') {
      realTimeArticles.push(...result.value);
    }
  });

  const publishedBaseArticles = BASE_ARTICLES.filter((a: any) => !a.isDraft);

  if (realTimeArticles.length > 0) {
    // Shuffle the array to mix categories
    realTimeArticles.sort(() => 0.5 - Math.random());
    // Combine published CMS articles with real time RSS articles
    cachedNews = [...publishedBaseArticles, ...realTimeArticles];
    lastFetchTime = Date.now();
    return cachedNews;
  }

  return publishedBaseArticles; // Fallback to CMS data if RSS fails entirely
}

// Background Batch Job for Top News Ranking
let cachedTopNews: any[] = [];
let cachedBreakingNews: any[] = [];

const updateTopNews = async () => {
  try {
    console.log("[Batch Job] Updating top news and breaking news rankings...");
    // Force a fresh fetch or get latest cached news
    const articles = await fetchRealTimeNews();
    if (articles && articles.length > 0) {
      cachedTopNews = getTopNews(articles, 50);
      cachedBreakingNews = getBreakingNews(articles);
      console.log(`[Batch Job] Generated ${cachedTopNews.length} top news and ${cachedBreakingNews.length} breaking news clusters.`);
    }
  } catch (error) {
    console.error("[Batch Job] Error updating news:", error);
  }
};

const expireBreakingNews = () => {
  if (cachedBreakingNews.length === 0) return;
  const now = Date.now();
  const valid = cachedBreakingNews.filter(cluster => {
    const markedAt = new Date(cluster.breaking_marked_at).getTime();
    const hoursSinceMarked = (now - markedAt) / (1000 * 60 * 60);
    return hoursSinceMarked <= 2;
  });

  if (valid.length !== cachedBreakingNews.length) {
    console.log(`[Batch Job] Expired ${cachedBreakingNews.length - valid.length} breaking news items.`);
    cachedBreakingNews = valid;
  }
};

// Run the batch job every 10 minutes (600,000 ms)
setInterval(updateTopNews, 10 * 60 * 1000);
// Run expiry check every 1 minute
setInterval(expireBreakingNews, 60 * 1000);
// Initial run after a short delay to allow first fetch
setTimeout(updateTopNews, 5000);

// GET Breaking News
app.get("/api/breaking-news", async (req, res) => {
  res.json(cachedBreakingNews);
});

// GET Top News (Clustered & Ranked)
app.get("/api/news/top", async (req, res) => {
  // If cache is empty (e.g. just started up), compute it on the fly
  if (cachedTopNews.length === 0) {
    const articles = await fetchRealTimeNews();
    cachedTopNews = getTopNews(articles, 10);
  }
  res.json(cachedTopNews);
});

// GET baseline trending news (now clustered & ranked)
app.get("/api/news/trending", async (req, res) => {
  if (cachedTopNews.length === 0) {
    const articles = await fetchRealTimeNews();
    cachedTopNews = getTopNews(articles, 50); // Get more articles for the main feed
    cachedBreakingNews = getBreakingNews(articles);
  }

  // Combine breaking news at the top, then top news
  const breakingIds = new Set(cachedBreakingNews.map(a => a.cluster_id));
  const remainingTopNews = cachedTopNews.filter(a => !breakingIds.has(a.cluster_id));

  res.json([...cachedBreakingNews, ...remainingTopNews]);
});

// GET specific topic news (Google News Search RSS)
app.get("/api/news/topic", async (req, res) => {
  const topic = req.query.q as string;
  if (!topic) return res.status(400).json({ error: "Missing topic query parameter" });

  try {
    // 1. Try to find local curated news matching this topic first
    let matchingArticles = cachedNews.filter(a =>
      a.category.toLowerCase().includes(topic.toLowerCase()) ||
      a.title.toLowerCase().includes(topic.toLowerCase()) ||
      a.summary.toLowerCase().includes(topic.toLowerCase())
    );

    if (matchingArticles.length > 0) {
      const topNews = getTopNews(matchingArticles, 30);
      const breakingNews = getBreakingNews(matchingArticles);
      const breakingIds = new Set(breakingNews.map(a => a.cluster_id));
      const remainingTopNews = topNews.filter(a => !breakingIds.has(a.cluster_id));
      return res.json([...breakingNews, ...remainingTopNews]);
    }

    // 2. Fallback to Google News if no curated matches found
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}+news&hl=en-US&gl=US&ceid=US:en`;
    const parsed = await parser.parseURL(rssUrl);

    // Define stripHtml locally just in case it wasn't extracted properly or we need it here
    const localStripHtml = (html: string) => {
      if (!html) return '';
      return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#147;/g, '"').replace(/&#148;/g, '"').replace(/&apos;/g, "'").trim();
    };

    const articles = parsed.items.slice(0, 30).map((item: any, idx) => {
      let originalImage = null;
      const isImageUrl = (url: string) => url && /\.(jpe?g|png|gif|webp)(\?.*)?$/i.test(url);

      if (item.enclosure && isImageUrl(item.enclosure.url)) originalImage = item.enclosure.url;
      else if (item.mediaContent && item.mediaContent.$ && isImageUrl(item.mediaContent.$.url)) originalImage = item.mediaContent.$.url;
      else if (item.mediaThumbnail && item.mediaThumbnail.$ && isImageUrl(item.mediaThumbnail.$.url)) originalImage = item.mediaThumbnail.$.url;
      else if (item.image && item.image.$ && isImageUrl(item.image.$.url)) originalImage = item.image.$.url;
      else if (item.thumbnail && item.thumbnail.$ && isImageUrl(item.thumbnail.$.url)) originalImage = item.thumbnail.$.url;

      if (!originalImage && item.link) {
        const ytLinkMatch = item.link.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (ytLinkMatch && ytLinkMatch[1]) {
          originalImage = `https://img.youtube.com/vi/${ytLinkMatch[1]}/hqdefault.jpg`;
        }
      }

      return {
        id: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}-${idx}-${Date.now()}`,
        title: item.title || "No Title",
        category: topic,
        summary: localStripHtml(item.contentSnippet || item.content || "No summary available."),
        content: localStripHtml(item.content || item.contentSnippet || "No detailed content available."),
        source: parsed.title || "Google News Fallback",
        date: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just Now",
        publishedAt: (item.pubDate && !isNaN(new Date(item.pubDate).getTime())) ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        readTime: "3 min read",
        imageUrl: originalImage || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=800&q=80",
        trendsUp: Math.random() > 0.5,
        views: Math.floor(Math.random() * 8000) + 1200,
        isAiGenerated: false,
        originalUrl: item.link || undefined
      };
    });

    const topNews = getTopNews(articles, 30);
    const breakingNews = getBreakingNews(articles);
    const breakingIds = new Set(breakingNews.map(a => a.cluster_id));
    const remainingTopNews = topNews.filter(a => !breakingIds.has(a.cluster_id));

    res.json([...breakingNews, ...remainingTopNews]);
  } catch (error) {
    console.error(`Error fetching topic ${topic}:`, error);
    res.status(500).json({ error: "Failed to fetch topic news" });
  }
});

// YouTube Video Caching
let cachedVideos: any[] = [];
let lastVideoFetchTime = 0;

async function fetchYouTubeVideos() {
  if (Date.now() - lastVideoFetchTime < CACHE_TTL && cachedVideos.length > 0) {
    return cachedVideos;
  }

  const channels = [
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC16niRr50-MSBwiO3YDb3RA', source: 'BBC News', region: 'Global' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCoMdktPbSTixAyNGwb-PUYA', source: 'Sky News', region: 'Global' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNye-wNBqNL5ZzHSJj3l8Bg', source: 'Al Jazeera', region: 'Middle East' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCupvZG-5ko_eiXAupbDfxWw', source: 'CNN', region: 'North America' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UChLtXXpo4Ge1ReTEboVvTDg', source: 'Global News', region: 'North America' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCZFMm1mMw0F81Z37AA81xEA', source: 'NDTV', region: 'South Asia' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC83jt4dlz1Gjl58fzQrrKZg', source: 'CNA', region: 'South East Asia' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCknLrEdhRCp1aegoMqRaCZg', source: 'DW News', region: 'Europe' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnUtS1XQJ-2tB3Ue3m-8gzw', source: 'ABC News In-depth', region: 'Oceania' },
    { url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCw1Nd-fF3o4QYinG-qTtyTA', source: 'Arise News', region: 'Africa' }
  ];

  let realTimeVideos: any[] = [];

  const fetchPromises = channels.map(async (channel) => {
    try {
      const parsed = await parser.parseURL(channel.url);
      return parsed.items.slice(0, 3).map((item: any, idx) => {
        let imageUrl = `https://img.youtube.com/vi/${item.ytVideoId}/maxresdefault.jpg`;
        if (item.mediaGroup && item.mediaGroup['media:thumbnail']) {
          imageUrl = item.mediaGroup['media:thumbnail'][0].$.url;
        }

        return {
          id: item.ytVideoId || `yt-${Date.now()}-${idx}`,
          title: item.title,
          duration: 'LIVE / NEW',
          source: channel.source,
          region: channel.region,
          views: Math.floor(Math.random() * 50000) + 5000 + ' views',
          isLive: false,
          imageUrl: imageUrl,
          youtubeUrl: item.link,
          date: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Recently",
          description: item.contentSnippet ? item.contentSnippet.substring(0, 150) + "..." : "Follow the latest live updates and breaking coverage."
        };
      });
    } catch (err) {
      console.error(`Error fetching YouTube feed ${channel.url}:`, err);
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      realTimeVideos.push(...result.value);
    }
  });

  if (realTimeVideos.length > 0) {
    realTimeVideos.sort(() => 0.5 - Math.random());
    cachedVideos = realTimeVideos;
    lastVideoFetchTime = Date.now();
    return cachedVideos;
  }

  return [];
}

// GET latest youtube videos
app.get("/api/news/videos", async (req, res) => {
  const videos = await fetchYouTubeVideos();
  res.json(videos);
});

// POST to generate a highly customized personal feed using local heuristics
app.post("/api/news/personalized", async (req, res) => {
  const { selectedCategories = [], selectedKeywords = [] } = req.body;

  if (selectedCategories.length === 0 && selectedKeywords.length === 0) {
    return res.json({
      briefing: "Select topics above to generate your customized editorial briefing.",
      articles: []
    });
  }

  // Generate localized customized morning overview briefing
  const briefingText = `Here is your customized Morning Briefing. We've compiled a tailored digest based on your interest in ${selectedCategories.join(", ") || "General News"} and custom focus on keywords: "${selectedKeywords.join(", ") || "Latest Trends"}". Today, key movements show high systemic shifts with carbon borders and technological transitions across the wire.`;

  // Advanced Personalization Scoring Engine
  const scoredArticles = BASE_ARTICLES.map(art => {
    let score = 0;
    
    const categoryMatches = selectedCategories.filter((cat: string) => 
      art.category && art.category.toLowerCase().includes(cat.toLowerCase())
    );
    score += categoryMatches.length * 3;

    const keywordMatches = selectedKeywords.filter((kw: string) => 
      (art.title && art.title.toLowerCase().includes(kw.toLowerCase())) || 
      (art.summary && art.summary.toLowerCase().includes(kw.toLowerCase()))
    );
    score += keywordMatches.length * 2;
    
    if (art.trendsUp) score += 1;
    if (art.views > 2000) score += 1;

    return { art, score };
  });

  const relevantScored = scoredArticles.filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  
  const resultArticles = relevantScored.length > 0 
    ? relevantScored.map(item => item.art).slice(0, 10) 
    : BASE_ARTICLES.slice(0, 3);

  // Modify slightly to tag as customized
  const customizedArticles = resultArticles.map((art, idx) => ({
    ...art,
    id: `custom-digest-${idx}-${Date.now()}`,
    title: `[Targeted Study] ${art.title}`,
    source: `Digest • ${art.source}`,
    readTime: "3 min read (Executive Summary)"
  }));

  return res.json({
    briefing: briefingText,
    articles: customizedArticles
  });
});

// POST to generate a deep-dive investigative follow-up on a selected headline locally
app.post("/api/news/generate-article", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title parameter is required." });
  }

  const paragraphs = [
    `The recent developments surrounding "${title}" have initiated intense debate among industry stakeholders and public policy architects. Analysts note that the current trends represent a significant departure from historic baselines, driven by shifting regulatory environments and technological transition schedules.`,
    `A primary focus of this situation centers on supply chain integrity and operational costs. Stakeholders are evaluating their capital allocations to hedge against volatility in key raw inputs and logistical corridors. Analysts suggest that organizations refusing to adapt to these changing operational parameters risk losing market share to agile, early-adopting competitors.`,
    `Furthermore, the legal and regulatory frameworks governing these activities are undergoing rapid evolution. Compliance managers report a substantial increase in audit intensity, with boundary mandates requiring precise documentation and performance metrics. Adapting to these standards is expected to require significant capital expenditure, though it provides long-term stability.`,
    `From a macroeconomic perspective, the broader implications could reshape regional markets over the next fiscal cycle. Financial institutions are adjusting their risk models to account for potential structural shifts, advising clients to maintain diversified portfolios and liquid positions.`,
    `In conclusion, the situation demands close, continuous observation. As industry leaders navigate these complex dynamics, the decisions made in the current quarter will likely establish the competitive benchmarks for years to come. Editorial desks will continue to monitor live feeds for further updates.`
  ];

  res.json({ content: paragraphs.join("\n\n") });
});

// POST to summarize a full article locally from its original URL
app.post("/api/news/summarize", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required." });
  }

  try {
    let rawContent = "";
    try {
      const fetchRes = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(8000)
      });
      if (fetchRes.ok) {
        const html = await fetchRes.text();
        const stripped = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
          .replace(/<[^>]*>?/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        rawContent = stripped.substring(0, 15000);
      }
    } catch (e) {
      console.warn("Could not fetch raw URL for summary:", url);
    }

    if (!rawContent || rawContent.length < 200) {
      return res.json({
        content: "The full article content is protected and could not be retrieved. Please visit the original source to read more."
      });
    }

    // Elegant local rule-based summarization: extract key sentences
    const sentences = rawContent
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 25 && !s.toLowerCase().includes('cookie') && !s.toLowerCase().includes('subscribe') && !s.toLowerCase().includes('privacy policy') && !s.toLowerCase().includes('terms of service'))
      .slice(0, 4);

    if (sentences.length === 0) {
      return res.json({
        content: "The article content is protected or could not be parsed for local summarization. Please visit the original source URL."
      });
    }

    const summaryText = sentences.join(" ") + "...";
    res.json({ content: summaryText });
  } catch (error: any) {
    console.error("Local summary generation error:", error);
    res.status(500).json({ error: "Failed to summarize article content." });
  }
});

// POST to scrape and extract full news report text from a URL using cheerio
app.post("/api/news/full-content", async (req, res) => {
  const { url, fallbackSummary } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required." });
  }

  try {
    const fetchRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch original page. Status: ${fetchRes.status}`);
    }

    const html = await fetchRes.text();
    const $ = cheerio.load(html);

    // Remove scripts, stylesheets, and irrelevant modules
    $('script, style, svg, noscript, footer, nav, header, aside, iframe, .cookie-notice, .footer, .header, .nav').remove();

    const paragraphs: string[] = [];
    const selectors = [
      'article p',
      '.article-body p',
      '.story-body p',
      '.main-content p',
      '.entry-content p',
      'main p',
      '.story p',
      '.content p',
      '.post-content p',
      '.article__body p'
    ];

    $(selectors.join(', ')).each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50 &&
        !text.toLowerCase().includes('cookie') &&
        !text.toLowerCase().includes('privacy policy') &&
        !text.toLowerCase().includes('terms of service') &&
        !text.toLowerCase().includes('subscribe') &&
        !text.toLowerCase().includes('sign in')) {
        paragraphs.push(text);
      }
    });

    // Fallback to any paragraphs if container-specific selectors yielded nothing
    if (paragraphs.length === 0) {
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 80 &&
          !text.toLowerCase().includes('cookie') &&
          !text.toLowerCase().includes('privacy policy') &&
          !text.toLowerCase().includes('terms of service') &&
          !text.toLowerCase().includes('subscribe') &&
          !text.toLowerCase().includes('sign in')) {
          paragraphs.push(text);
        }
      });
    }

    if (paragraphs.length > 0) {
      return res.json({ content: paragraphs.join('\n\n') });
    }

    // If scraping returned no text (e.g. paywall/anti-scraping), use fallback summary
    return res.json({
      content: fallbackSummary
        ? `${fallbackSummary}\n\n(Note: The full report text is protected behind a paywall or login screen. Please click the link below to read the original article directly.)`
        : "The full report text is protected or could not be parsed. Please click the link below to read the original article directly."
    });

  } catch (error: any) {
    console.error("Full content scraping error:", error.message);
    return res.json({
      content: fallbackSummary
        ? `${fallbackSummary}\n\n(Note: Connection to the original news server timed out or failed. Please click the link below to view the original report.)`
        : "Failed to establish a connection to the original news host. Please check the original source link below."
    });
  }
});

// In-memory store for citizen reports
const citizenReports: any[] = [
  {
    id: `rep-${Date.now() - 100000}`,
    headline: "Suspicious activity near the old industrial park",
    category: "Alert",
    location: "Downtown District, 4th Ave",
    details: "I noticed several unmarked vans parking near the abandoned warehouse last night. There were people moving large crates. Has anyone else seen this? Might be worth avoiding the area after dark.",
    mediaUrl: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80",
    timestamp: new Date(Date.now() - 100000 * 60).toISOString(),
    status: 'Verified'
  },
  {
    id: `rep-${Date.now() - 500000}`,
    headline: "Community cleanup at Riverside Park this weekend!",
    category: "Community Event",
    location: "Riverside Park",
    details: "We are organizing a massive cleanup effort this Saturday morning. The city is providing garbage bags and gloves. Let's get our park looking beautiful again for the summer!",
    mediaUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    timestamp: new Date(Date.now() - 500000 * 60).toISOString(),
    status: 'Verified'
  },
  {
    id: `rep-${Date.now() - 900000}`,
    headline: "Water main break on 5th Street causing severe flooding",
    category: "Incident",
    location: "5th Street & Elm",
    details: "Massive water main just burst. The street is completely flooded and traffic is backed up for miles. Avoid the area! City crews just arrived on the scene.",
    mediaUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80",
    timestamp: new Date(Date.now() - 900000 * 60).toISOString(),
    status: 'Verified'
  }
];

// POST to receive citizen journalism reports
app.post("/api/news/report", (req, res) => {
  const { headline, category, location, details, mediaUrl } = req.body;
  if (!headline || !details || !location) {
    return res.status(400).json({ error: "Headline, location, and details are required." });
  }

  const newReport = {
    id: `rep-${Date.now()}`,
    headline,
    category,
    location,
    details,
    mediaUrl: mediaUrl || null,
    timestamp: new Date().toISOString(),
    status: 'Verified'
  };

  citizenReports.unshift(newReport);
  console.log(`[CITIZEN REPORT RECEIVED] ${category}: ${headline} at ${location}`);

  // Simulate processing time
  setTimeout(() => {
    res.json({ success: true, message: "Report ingested successfully.", report: newReport });
  }, 1500);
});

// GET to fetch citizen journalism reports
app.get("/api/news/reports", (req, res) => {
  res.json(citizenReports);
});

// Real-time Push Notification Simulation endpoint
app.get("/api/news/alerts", (req, res) => {
  const ALERTS = [
    {
      id: "al-1",
      timestamp: "Just Now",
      type: "breaking",
      title: "BREAKING NEWS",
      message: "Silicon Valley grid operator registers sudden 400% surge in green tariff load."
    },
    {
      id: "al-2",
      timestamp: "5 min ago",
      type: "market",
      title: "MARKET ALERT",
      message: "Silicon Photonics manufacturers rally +6.2% following room-temperature coherence reports."
    },
    {
      id: "al-3",
      timestamp: "15 min ago",
      type: "personalized",
      title: "PERSONALIZED UPDATE",
      message: "Deep-sea thermal vents mapped with sub-millimeter precision using novel sound traps."
    }
  ];
  res.json(ALERTS);
});

// ─── FIFA World Cup 2026 Match Results ──────────────────────────────────────
// Uses football-data.org free tier (requires FOOTBALL_DATA_API_KEY in .env)
// Competition ID for FIFA World Cup 2026 will be confirmed once registered.
// Free tier: 10 requests/min, results delayed ~10 min. No live scores.

// generateMockGoals removed

const wcMatchCache: Record<string, { data: any, timestamp: number }> = {};

app.get('/api/football/wc2026', async (req, res) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    // No key configured — return clear error so frontend can show fallback
    return res.status(503).json({
      error: 'FOOTBALL_DATA_API_KEY not configured.',
      hint: 'Get a free key at https://www.football-data.org/client/register and add it to your .env file.'
    });
  }

  try {
    // FIFA World Cup 2026 competition code: WC (confirmed by football-data.org)
    const statusParam = req.query.status ? String(req.query.status) : 'FINISHED';
    
    // Serve from cache if less than 60 seconds old
    const now = Date.now();
    if (wcMatchCache[statusParam] && (now - wcMatchCache[statusParam].timestamp < 60000)) {
      return res.json(wcMatchCache[statusParam].data);
    }

    const response = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?status=${statusParam}&limit=20`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `football-data.org error: ${errText}` });
    }

    const data = await response.json();
    const rawMatches = data.matches || [];
    const sorted = [...rawMatches].sort((a: any, b: any) => {
      if (req.query.status === 'SCHEDULED') {
        return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
      }
      return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
    });

    const matches = sorted.map((m: any) => ({
      id: m.id,
      team1: m.homeTeam?.tla || m.homeTeam?.shortName || m.homeTeam?.name || 'TBD',
      flag1: m.homeTeam?.crest || null,
      score1: m.score?.fullTime?.home ?? '-',
      team2: m.awayTeam?.tla || m.awayTeam?.shortName || m.awayTeam?.name || 'TBD',
      flag2: m.awayTeam?.crest || null,
      score2: m.score?.fullTime?.away ?? '-',
      status: m.status === 'FINISHED' ? 'FT' : m.status === 'IN_PLAY' ? 'LIVE' : m.status,
      date: new Date(m.utcDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      utcDate: m.utcDate,
      winner: m.score?.winner || null,
      scorers: []
    }));

    const payload = { matches, updatedAt: new Date().toISOString() };
    wcMatchCache[statusParam] = { data: payload, timestamp: now };
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch match data.' });
  }
});

// Player photo cache to minimize API calls
const playerPhotoCache: Record<string, string | null> = {};

// Scorer endpoint
app.get('/api/football/wc2026/scorers', async (req, res) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

  if (!API_KEY) {
    return res.json({ scorers: [], isMock: false });
  }
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/scorers?limit=10', {
      headers: { 'X-Auth-Token': API_KEY }
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
    const data = await response.json();
    const scorersRaw = data.scorers || [];
    
    // Fetch photos for each scorer concurrently, using cache
    const scorers = await Promise.all(scorersRaw.map(async (s: any) => {
      const playerName = s.player.name;
      let playerImage = playerPhotoCache[playerName];

      // If not in cache, fetch it from TheSportsDB
      if (playerImage === undefined) {
        try {
          const searchRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(playerName)}`);
          const searchData = await searchRes.json();
          if (searchData.player && searchData.player.length > 0) {
            playerImage = searchData.player[0].strCutout || searchData.player[0].strThumb || null;
          } else {
            playerImage = null;
          }
          playerPhotoCache[playerName] = playerImage || null;
        } catch (err) {
          console.error(`Failed to fetch photo for ${playerName}:`, err);
          playerImage = null;
          playerPhotoCache[playerName] = null;
        }
      }

      return {
        name: playerName,
        team: s.team.tla || s.team.shortName || s.team.name,
        goals: s.goals,
        assists: s.assists || 0,
        penalties: s.penalties || 0,
        flag: s.team.crest || null,
        playerImage: playerImage
      };
    }));
    res.json({ scorers, updatedAt: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Live Real-Time Football API (API-Football)
app.get('/api/football/live', async (req, res) => {
  const API_KEY = process.env.API_FOOTBALL_KEY;

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: [], isMock: false });
  }

  try {
    const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-apisports-key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API-Football error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      throw new Error(`API-Football API Error: ${JSON.stringify(data.errors)}`);
    }

    const rawMatches = data.response || [];
    const liveMatches = rawMatches.map((m: any) => ({
      id: m.fixture.id,
      team1: m.teams.home.name,
      flag1: m.teams.home.logo,
      score1: m.goals.home ?? 0,
      team2: m.teams.away.name,
      flag2: m.teams.away.logo,
      score2: m.goals.away ?? 0,
      status: `${m.fixture.status.elapsed}'`,
      date: new Date(m.fixture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      utcDate: m.fixture.date,
      goals: m.events
        ? m.events.filter((e: any) => e.type === 'Goal').map((e: any) => ({
          minute: e.time.elapsed,
          scorer: e.player.name
        }))
        : []
    }));

    return res.json({ matches: liveMatches, isMock: false });
  } catch (err: any) {
    console.error('[Football/live]', err.message);
    return res.json({ matches: [], isMock: false, error: err.message });
  }
});

// ─── ICC Cricket ─────────────────────────────────────────────────────────────
// Shared helper to parse score arrays from CricAPI
function parseCricScore(scoreArr: any[]): any[] {
  if (!scoreArr || !Array.isArray(scoreArr) || scoreArr.length === 0) return [];
  return scoreArr.map((s: any) => {
    const teamPrefix = s.inning ? s.inning.split(' ').slice(0, 2).join(' ') : '';
    const wickets = s.w !== undefined ? `/${s.w}` : '';
    const overs = s.o !== undefined ? ` (${s.o}ov)` : '';

    let crr = '';
    if (s.r !== undefined && s.o !== undefined && s.o > 0) {
      const overParts = s.o.toString().split('.');
      const completeOvers = parseInt(overParts[0], 10) || 0;
      const balls = overParts[1] ? parseInt(overParts[1], 10) : 0;
      const totalOversDec = completeOvers + (balls / 6);
      if (totalOversDec > 0) {
        crr = (s.r / totalOversDec).toFixed(2);
      }
    }

    return {
      team: teamPrefix,
      score: `${s.r}${wickets}${overs}`,
      runs: s.r,
      wickets: s.w,
      overs: s.o,
      crr: crr
    };
  });
}

// Detect Men / Women from match name
function detectGender(name: string): 'Women' | 'Men' {
  return /women/i.test(name) ? 'Women' : 'Men';
}

// Only keep ICC International matches.
// CricAPI often labels ICC Women's T20WC matches as 't20' (not 't20i'), so we
// use a name-based fallback for known ICC/international tournament keywords.
const ICC_INTERNATIONAL_TYPES = new Set(['test', 'odi', 't20i']);
const ICC_NAME_KEYWORDS = [
  /\bICC\b/i,                   // ICC T20 World Cup, ICC CWC, etc.
  /world cup/i,                  // Men's/Women's WC
  /world test championship/i,
  /\bwtc\b/i,
  /bilateral/i,
  /tour of/i,                   // e.g. "Afghanistan tour of India"
  /\btest\b.*\bvs\b/i,
  /\b(t20i|odi|test)\b/i,       // match name mentions the format explicitly
];

function isInternational(m: any): boolean {
  const type = (m.matchType || '').toLowerCase().trim();
  // Direct type match (test / odi / t20i)
  if (ICC_INTERNATIONAL_TYPES.has(type)) return true;
  // For matches typed as plain 't20', check if the name implies ICC/international
  if (type === 't20') {
    const name = m.name || '';
    return ICC_NAME_KEYWORDS.some(re => re.test(name));
  }
  return false;
}

// Shared cached CricAPI fetch so all 3 tabs use one API call
let cricketCache: { data: any[] | null; ts: number } = { data: null, ts: 0 };
const CRICKET_CACHE_TTL = 60_000; // 1 minute

async function fetchCricketMatches(apiKey: string): Promise<any[]> {
  if (cricketCache.data && Date.now() - cricketCache.ts < CRICKET_CACHE_TTL) {
    return cricketCache.data;
  }
  const response = await fetch(
    `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`
  );
  if (!response.ok) throw new Error(`CricAPI HTTP ${response.status}`);
  const json = await response.json();
  console.log('[Cricket] API status:', json.status, '| total matches:', json.data?.length ?? 0);
  if (json.status !== 'success' || !Array.isArray(json.data)) {
    throw new Error(`CricAPI error: ${json.status}`);
  }
  cricketCache = { data: json.data, ts: Date.now() };
  return json.data;
}

// Live / In-Progress matches
app.get('/api/cricket/live', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: [], isMock: false });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const liveMatches = allMatches
      .filter((m: any) => isInternational(m) && m.matchStarted && !m.matchEnded)
      .sort((a: any, b: any) => (detectGender(a.name) === 'Men' ? 0 : 1) - (detectGender(b.name) === 'Men' ? 0 : 1))
      .slice(0, 10)
      .map((m: any) => ({
        title: m.name,
        matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
        status: m.status || 'In Progress',
        score: parseCricScore(m.score),
        matchStarted: true,
        gender: detectGender(m.name)
      }));

    return res.json({ matches: liveMatches, isMock: false });
  } catch (err: any) {
    console.error('[Cricket/live]', err.message);
    return res.json({ matches: [], isMock: false, error: err.message });
  }
});

// Recent Results (completed matches)
app.get('/api/cricket/results', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: [], isMock: false });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const completedMatches = allMatches
      .filter((m: any) => isInternational(m) && m.matchEnded === true)
      .sort((a: any, b: any) => {
        const genderDiff = (detectGender(a.name) === 'Men' ? 0 : 1) - (detectGender(b.name) === 'Men' ? 0 : 1);
        if (genderDiff !== 0) return genderDiff;
        // Sort chronologically (latest first)
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 50)
      .map((m: any) => ({
        title: m.name,
        matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
        status: m.status || 'Match Ended',
        score: parseCricScore(m.score),
        date: m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        venue: m.venue || '',
        gender: detectGender(m.name)
      }));

    return res.json({ matches: completedMatches, isMock: false });
  } catch (err: any) {
    console.error('[Cricket/results]', err.message);
    return res.json({ matches: [], isMock: false, error: err.message });
  }
});

// Upcoming Fixtures (not yet started)
app.get('/api/cricket/fixtures', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: [], isMock: false });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const upcomingMatches = allMatches
      .filter((m: any) => isInternational(m) && !m.matchStarted)
      .sort((a: any, b: any) => {
        const genderDiff = (detectGender(a.name) === 'Men' ? 0 : 1) - (detectGender(b.name) === 'Men' ? 0 : 1);
        if (genderDiff !== 0) return genderDiff;
        // Sort chronologically (soonest first)
        const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        return dateA - dateB;
      })
      .slice(0, 50)
      .map((m: any) => {
        const matchDate = m.date ? new Date(m.date) : null;
        return {
          title: m.name,
          matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
          status: 'Upcoming',
          utcDate: m.date || null,
          venue: m.venue || '',
          gender: detectGender(m.name)
        };
      });

    return res.json({ matches: upcomingMatches, isMock: false });
  } catch (err: any) {
    console.error('[Cricket/fixtures]', err.message);
    return res.json({ matches: [], isMock: false, error: err.message });
  }
});

// DEBUG: Inspect raw CricAPI response
app.get('/api/cricket/debug', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;
  if (!API_KEY) return res.json({ error: 'No API key' });
  try {
    // Bust cache for debug
    cricketCache = { data: null, ts: 0 };
    const allMatches = await fetchCricketMatches(API_KEY);
    const summary = allMatches.map((m: any) => ({
      name: m.name,
      matchType: m.matchType,
      matchStarted: m.matchStarted,
      matchEnded: m.matchEnded,
      isInternational: isInternational(m),
      status: m.status
    }));
    res.json({ total: allMatches.length, matches: summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// YouTube Data API v3 integration for dynamic match highlights
app.get('/api/youtube/highlights', async (req, res) => {
  const { team1, team2 } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY || API_KEY === "") {
    return res.status(503).json({ error: 'YOUTUBE_API_KEY not configured.' });
  }

  if (!team1 || !team2) {
    return res.status(400).json({ error: 'team1 and team2 query parameters are required.' });
  }

  try {
    const query = encodeURIComponent(`${team1} vs ${team2} world cup highlights`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=1&videoEmbeddable=true&key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `YouTube API error: ${errText}` });
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return res.json({ videoId: data.items[0].id.videoId });
    } else {
      return res.status(404).json({ error: 'No highlight video found for this match.' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch YouTube highlights.' });
  }
});

const sseClients = new Set<express.Response>();

app.get('/api/news/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

/*
setInterval(() => {
  if (sseClients.size === 0) return;
  const breakNews = {
    id: `live-break-${Date.now()}`,
    title: `BREAKING: Unprecedented Strategic Development Logged at ${new Date().toLocaleTimeString()}`,
    category: "Global",
    summary: "Live reports are streaming in regarding a major shift in global policy...",
    content: "Details are still emerging. Our on-the-ground teams are actively investigating.",
    source: "Horizon Live Desk",
    date: "Just now",
    readTime: "1 min read",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
    trendsUp: true,
    views: Math.floor(Math.random() * 5000) + 1000,
    is_breaking: true,
    publishedAt: new Date().toISOString()
  };
  const payload = `data: ${JSON.stringify(breakNews)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}, 45000);
*/

// Vite Server middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Horizon Post server booted on http://localhost:${PORT}`);
  });
}

startServer();
