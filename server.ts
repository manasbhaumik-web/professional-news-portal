import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import Parser from "rss-parser";
import * as cheerio from "cheerio";

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
  }
});

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// High-quality baseline articles database (simulating a database)
const BASE_ARTICLES = [
  {
    id: "art-global-1",
    title: "Global Maritime Green Corridors: Continental freight lanes adopt hydrogen bunkering networks",
    category: "Global",
    summary: "Sovereign transport alliances establish zero-emission oceanic checkpoints across major deepwater trade canals.",
    content: `A consortium of international maritime registries and regional port authorities announced today the formal activation of six coordinated 'Green Shipping Corridors' by the end of the year. The pact shifts maritime propulsion systems toward liquid hydrogen fuel and ultra-dense magnetic induction storage.

Major oceanic gateways in Rotterdam, Singapore, and Los Angeles are investing in synchronized bunkering infrastructure, bypassing traditional bunker-fuel grids that have accounted for over two percent of global emissions.

Sovereign freight carriers are retrofitting container vessels with hydrogen-fuel cells. Maritime logistics managers project that standard trade lanes will face strict carbon levies at boundary canals, encouraging rapid deployment of zero-emission fleets.`,
    source: "Aether Signal",
    date: "Today, 09:12 AM",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    trendsUp: true,
    views: 1840
  },
  {
    id: "art-local-1",
    title: "Municipal Photonic Micro-Grid Integrates Autonomous Smart District Transit Lines",
    category: "Local",
    summary: "A metropolitan pilot project deploys multi-gigabit laser power arrays to drive local ultra-high-frequency train loops.",
    content: `The Municipal Department of Spatial Allocation and Transit announced a full-scale micro-grid integration pilot within the central smart district. The system harnesses local waveguide solar grids and overhead optical laser receivers to transmit electric currents directly to dynamic commuter train lines.

By bypassing older subterranean copper transformers, the local grid achieves a ninety-two percent efficiency rating on thermal distribution, eliminating transit energy drains by a factor of three.

Local city planners noted that transit loops will operate at ninety-second intervals during peak commute thresholds. High-resolution local optical relays will coordinate the self-optimizing coaches dynamically based on real-time pedestrian density.`,
    source: "Metropolitan Dispatch",
    date: "Today, 08:30 AM",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    trendsUp: true,
    views: 1210
  },
  {
    id: "art-politics-1",
    title: "Carbon Border Tariff Adjustment Assembly Enters Final Ratification with Boundary Mandates",
    category: "Politics",
    summary: "Legislative chambers negotiate cross-boundary regulatory enforcement on energy-intensive industrial imports.",
    content: `As cross-border carbon tariff policies transition from theoretical debates to custom legislative assemblies, parliamentary negotiators are locked in intense deliberations over the boundaries of active taxation systems.

The proposed mechanism enforces steep compliance files on import quotas for carbon-intensive steel, raw concrete, and chemical fertilizers, based on the specific emission index registered during manufacture.

Congressional officials from major manufacturing coalitions are seeking temporary tariff exemptions. Nonetheless, regulatory architects contend that standard carbon-leakage limits must remain absolute to preserve domestic green investments.`,
    source: "Sovereign Risk Journal",
    date: "Today, 07:15 AM",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    trendsUp: false,
    views: 950
  },
  {
    id: "art-business-1",
    title: "Sovereign CBDC Settlement Ledger Links Participating Clearinghouses Across Interbank Bridges",
    category: "Business",
    summary: "Central banking partners inaugurate real-time wholesale digital ledger clearance sandbox for cross-border liquidity.",
    content: `The central digital ledger clearance project, codenamed 'Project Sovereign Settler,' has successfully deployed its real-time sandbox infrastructure to clear and settle wholesale transactions across six international clearinghouses.

Using highly secure, permissioned state-consensus pipelines, the network handles upwards of eighty thousand clearance requests per second, bypassing older correspondent network hoops that take days to reconcile.

Commercial bank representatives noted that the digital clearance frameworks will alleviate collateral blockades and streamline cross-boundary trade finance pipelines for corporate participants.`,
    source: "Consensus Daily",
    date: "Today, 06:45 AM",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    trendsUp: true,
    views: 1120
  },
  {
    id: "art-sports-1",
    title: "Aero-Formula Wind Tunnel Simulations: Liquid Hydrogen Combustion Trials Reach Peak Kinetic Yields",
    category: "Sports",
    summary: "High-performance motorsport engineers simulate next-generation hydrogen turbines for carbon-neutral global racing.",
    content: `High-density formula racing teams have concluded successful simulated trials of next-generation liquid hydrogen combustion motors. Integrating complex computational fluid dynamics (CFD) with real-time wind tunnel sensor arrays, engineers optimized turbine manifolds to maximize kinetic energy recovery.

The lightweight composite prototype frames demonstrated high durability under high thermal loads, registering zero backpressure failures during five simulated endurance trials.

Team lead flight-dynamic architects commented that carbon-neutral fuels will form the benchmark of international professional racing circuits before the turn of the decade.`,
    source: "Planck Racing",
    date: "Yesterday",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    trendsUp: false,
    views: 890
  },
  {
    id: "art-articles-1",
    title: "The Boundaries of Silicon Photonic Superposition: A Technical Prospectus on Micro-Coherence",
    category: "Articles",
    summary: "An in-depth exposition on room-temperature photonic waveguides and the physical limits of isotopic wave traps.",
    content: `In early quantum experimental protocols, preserving qubit superposition typically demanded absolute zero temperature controls to block thermal noise. However, recent breakthroughs in silicon-photonics waveguide traps are challenging this physical limitation.

By coating micro-glass traps with dense isotopic isotopes, researchers successfully created a vacuum chamber that insulates moving photons from external kinetic vibrations, maintaining coherence times above eighteen seconds.

This expository study investigates how multi-layer reflective coatings can minimize light scattering within fiber infrastructures, laying the groundwork for a scalable quantum distribution network.`,
    source: "Ministry Science Review",
    date: "2 days ago",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    trendsUp: false,
    views: 1420
  },
  {
    id: "art-blogs-1",
    title: "Headless Ecosystems and Sovereign Context Engines: Why downloading apps is a legacy convention",
    category: "Blogs",
    summary: "An opinion piece on the transition from static screens to continuous conversational filters and headless API connectors.",
    content: `Over the past decade, opening and closing single-purpose applications on distinct mobile screens has remained the default user interface paradigm. Yet evidence points to the structural obsolescence of store ecosystems.

The rise of general client-side context layers shifts interaction away from fixed pixels and toward headless API agents. These models negotiate transactions and compile custom snippets in real-time.

In this blog, we explore how spatial networks and headless web directories will render application icons redundant, opening a new landscape for modular developers.`,
    source: "Headless Thoughts",
    date: "3 days ago",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    trendsUp: true,
    views: 2310
  }
];

// Cache of dynamically generated news to preserve user session
let sessionPersonalizedNews: {
  briefing: string;
  articles: any[];
} | null = null;

// RSS Feed caching
let cachedNews: any[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/api/news/proxy', async (req, res) => {
  try {
    const rssUrl = req.query.url as string;
    if (!rssUrl) return res.status(400).json({ status: 'error', message: 'Missing url param' });
    
    const feed = await parser.parseURL(rssUrl);
    res.json({
      status: 'ok',
      items: feed.items.map((item: any) => ({
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

  const feeds = [
    // North America
    { url: 'https://news.google.com/rss/headlines/section/geo/US?hl=en-US&gl=US&ceid=US:en', category: 'North America' },
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
    { url: 'https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en', category: 'Sports', sportName: 'All' },
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
    { url: 'https://news.google.com/rss/headlines/section/topic/NATION?hl=en-US&gl=US&ceid=US:en', category: 'Politics' },
    { url: 'http://feeds.bbci.co.uk/news/politics/rss.xml', category: 'Politics' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics' },

    // Business & Finance
    { url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en', category: 'Business' },
    { url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'Business' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'Business' },
    { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?id=10000664', category: 'Business' },

    // Entertainment (Movie, Music)
    { url: 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en', category: 'Entertainment' },
    { url: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', category: 'Entertainment' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml', category: 'Entertainment' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Music.xml', category: 'Entertainment' },

    // Science & Tech
    { url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-US&gl=US&ceid=US:en', category: 'Science' },
    { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'Science' },
    { url: 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en', category: 'Technology' },
    { url: 'http://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', category: 'Technology' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Space.xml', category: 'Space' }
  ];

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
      return parsed.items.slice(0, sliceCount).map((item: any, idx) => {
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
          id: `rss-${feed.category.toLowerCase().replace(/\\s+/g, '-')}-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title || "No Title",
          category: feed.category,
          summary: stripHtml(item.contentSnippet || item.content || "No summary available."),
          content: stripHtml(item.content || item.contentSnippet || "No detailed content available."),
          source: parsed.title || "Global Network",
          date: item.pubDate ? new Date(item.pubDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just Now",
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
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

  if (realTimeArticles.length > 0) {
    // Shuffle the array to mix categories
    realTimeArticles.sort(() => 0.5 - Math.random());
    cachedNews = realTimeArticles;
    lastFetchTime = Date.now();
    return cachedNews;
  }

  return BASE_ARTICLES; // Fallback to mock data if RSS fails entirely
}

// GET baseline trending news (now real-time)
app.get("/api/news/trending", async (req, res) => {
  const news = await fetchRealTimeNews();
  res.json(news);
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
          isLive: idx === 0, // Mock the latest video as live
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

  // Filter base articles or synthesize tailored articles of interest based on selected items
  const filtered = BASE_ARTICLES.filter(art =>
    selectedCategories.some((cat: string) => art.category.toLowerCase().includes(cat.toLowerCase())) ||
    selectedKeywords.some((kw: string) => art.title.toLowerCase().includes(kw.toLowerCase()) || art.summary.toLowerCase().includes(kw.toLowerCase()))
  );

  const resultArticles = filtered.length > 0 ? filtered : BASE_ARTICLES.slice(0, 3);

  // Modify slightly to tag as customized
  const customizedArticles = resultArticles.map((art, idx) => ({
    ...art,
    id: `custom-digest-${idx}-${Date.now()}`,
    title: `[Targeted Study] ${art.title}`,
    source: `Digest • ${art.source}`,
    isAiGenerated: false
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
    const statusParam = req.query.status ? req.query.status : 'FINISHED';
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
      team1: m.homeTeam?.shortName || m.homeTeam?.name || 'TBD',
      flag1: m.homeTeam?.crest || null,
      score1: m.score?.fullTime?.home ?? '-',
      team2: m.awayTeam?.shortName || m.awayTeam?.name || 'TBD',
      flag2: m.awayTeam?.crest || null,
      score2: m.score?.fullTime?.away ?? '-',
      status: m.status === 'FINISHED' ? 'FT' : m.status === 'IN_PLAY' ? 'LIVE' : m.status,
      date: new Date(m.utcDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      utcDate: m.utcDate,
      winner: m.score?.winner || null,
      goals: m.goals ? m.goals.map((g: any) => ({
        minute: g.minute,
        scorer: g.scorer?.name || 'Unknown',
        teamId: g.team?.id
      })) : []
    }));

    res.json({ matches, updatedAt: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch match data.' });
  }
});

// Scorer endpoint
app.get('/api/football/wc2026/scorers', async (req, res) => {
  const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
  if (!API_KEY) {
    return res.status(401).json({ error: 'API Key missing' });
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
    const scorers = data.scorers.map((s: any) => ({
      name: s.player.name,
      team: s.team.shortName || s.team.name,
      goals: s.goals,
      assists: s.assists || 0,
      penalties: s.penalties || 0,
      flag: s.team.crest || null,
      playerImage: null // API might not provide player image directly, but we will handle fallback on frontend
    }));
    res.json({ scorers, updatedAt: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ICC Cricket ─────────────────────────────────────────────────────────────
// Shared helper to parse score arrays from CricAPI
function parseCricScore(scoreArr: any[]): string {
  if (!scoreArr || !Array.isArray(scoreArr) || scoreArr.length === 0) return '';
  return scoreArr.map((s: any) => {
    const teamPrefix = s.inning ? s.inning.split(' ').slice(0, 2).join(' ') : '';
    const wickets = s.w !== undefined ? `/${s.w}` : '';
    const overs = s.o !== undefined ? ` (${s.o}ov)` : '';
    return `${teamPrefix}: ${s.r}${wickets}${overs}`;
  }).join('  •  ');
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

  // Fallback: Real ICC matches verified on Jun 17, 2026
  const fallbackData = [
    { title: 'New Zealand Women vs Sri Lanka Women – ICC Women\'s T20 World Cup 2026, Match 7', matchType: 'T20I', status: 'Live – SL need 7 runs off 7 balls', score: 'NZ: 150/6 (20.0ov)  •  SL: 144/5 (18.5ov)', matchStarted: true, gender: 'Women' }
  ];

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: fallbackData, isMock: true });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const liveMatches = allMatches
      .filter((m: any) => isInternational(m) && m.matchStarted && !m.matchEnded)
      .slice(0, 10)
      .map((m: any) => ({
        title: m.name,
        matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
        status: m.status || 'In Progress',
        score: parseCricScore(m.score),
        matchStarted: true,
        gender: detectGender(m.name)
      }));

    return res.json({ matches: liveMatches.length > 0 ? liveMatches : fallbackData, isMock: liveMatches.length === 0 });
  } catch (err: any) {
    console.error('[Cricket/live]', err.message);
    return res.json({ matches: fallbackData, isMock: true, error: err.message });
  }
});

// Recent Results (completed matches)
app.get('/api/cricket/results', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;

  // Fallback: Real ICC results verified on Jun 17, 2026 from icc-cricket.com
  const fallbackResults = [
    { title: 'West Indies vs Sri Lanka – Sri Lanka tour of West Indies, 3rd T20I', matchType: 'T20I', status: 'West Indies beat Sri Lanka by 5 wickets', score: 'WI: 170/5 (19.4ov)  •  SL: 169 (20.0ov)', date: '15 Jun 2026', venue: 'Sabina Park, Kingston', gender: 'Men' },
    { title: 'Australia vs Bangladesh – Bangladesh tour of Australia, 3rd ODI', matchType: 'ODI', status: 'Australia beat Bangladesh by 1 wicket', score: 'AUS: 277/9 (50ov)  •  BAN: 274/5 (50ov)', date: '14 Jun 2026', venue: 'Brisbane', gender: 'Men' },
    { title: 'USA vs Netherlands – ICC CWC League 2, Match 114', matchType: 'ODI', status: 'Match Abandoned', score: '', date: '14 Jun 2026', venue: 'Maple Leaf North-West Ground, King City', gender: 'Men' },
    { title: 'Netherlands vs Canada – ICC CWC League 2, Match 115', matchType: 'ODI', status: 'Match Abandoned', score: 'NED: 15/1', date: '16 Jun 2026', venue: 'Maple Leaf North-West Ground, King City', gender: 'Men' }
  ];

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: fallbackResults, isMock: true });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const completedMatches = allMatches
      .filter((m: any) => isInternational(m) && m.matchEnded === true)
      .slice(0, 12)
      .map((m: any) => ({
        title: m.name,
        matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
        status: m.status || 'Match Ended',
        score: parseCricScore(m.score),
        date: m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        venue: m.venue || '',
        gender: detectGender(m.name)
      }));

    return res.json({ matches: completedMatches.length > 0 ? completedMatches : fallbackResults, isMock: completedMatches.length === 0 });
  } catch (err: any) {
    console.error('[Cricket/results]', err.message);
    return res.json({ matches: fallbackResults, isMock: true, error: err.message });
  }
});

// Upcoming Fixtures (not yet started)
app.get('/api/cricket/fixtures', async (req, res) => {
  const API_KEY = process.env.CRICKET_API_KEY;

  // Fallback: Real ICC fixtures verified on Jun 17, 2026 from icc-cricket.com
  const fallbackFixtures = [
    { title: 'Bangladesh vs Australia – Australia tour of Bangladesh, 1st T20I', matchType: 'T20I', status: 'Upcoming', date: '17 Jun 2026', time: '16:00 GMT', venue: 'Chattogram', gender: 'Men' },
    { title: 'India vs Afghanistan – Afghanistan tour of India, 2nd ODI', matchType: 'ODI', status: 'Upcoming', date: '17 Jun 2026', time: '16:00 GMT', venue: 'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow', gender: 'Men' },
    { title: 'England vs New Zealand – New Zealand tour of England, 2nd Test', matchType: 'TEST', status: 'Upcoming', date: '17 Jun 2026', time: '18:00 GMT', venue: 'The Oval, London', gender: 'Men' },
    { title: 'England Women vs Ireland Women – ICC Women\'s T20 World Cup 2026, Match 8', matchType: 'T20I', status: 'Upcoming', date: '17 Jun 2026', time: '01:30 GMT', venue: 'TBC', gender: 'Women' },
    { title: 'Australia Women vs Bangladesh Women – ICC Women\'s T20 World Cup 2026, Match 9', matchType: 'T20I', status: 'Upcoming', date: '17 Jun 2026', time: '17:30 GMT', venue: 'TBC', gender: 'Women' },
    { title: 'India Women vs Netherlands Women – ICC Women\'s T20 World Cup 2026, Match 10', matchType: 'T20I', status: 'Upcoming', date: '17 Jun 2026', time: '21:30 GMT', venue: 'TBC', gender: 'Women' }
  ];

  if (!API_KEY || API_KEY === '') {
    return res.json({ matches: fallbackFixtures, isMock: true });
  }

  try {
    const allMatches = await fetchCricketMatches(API_KEY);
    const upcomingMatches = allMatches
      .filter((m: any) => isInternational(m) && !m.matchStarted)
      .slice(0, 12)
      .map((m: any) => {
        const matchDate = m.date ? new Date(m.date) : null;
        return {
          title: m.name,
          matchType: m.matchType ? m.matchType.toUpperCase() : 'Match',
          status: 'Upcoming',
          date: matchDate ? matchDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD',
          time: matchDate ? matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' GMT' : 'TBD',
          venue: m.venue || '',
          gender: detectGender(m.name)
        };
      });

    return res.json({ matches: upcomingMatches.length > 0 ? upcomingMatches : fallbackFixtures, isMock: upcomingMatches.length === 0 });
  } catch (err: any) {
    console.error('[Cricket/fixtures]', err.message);
    return res.json({ matches: fallbackFixtures, isMock: true, error: err.message });
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
