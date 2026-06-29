import natural from 'natural';

const TfIdf = natural.TfIdf;

export interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt?: string;
  date?: string;
  url?: string;
  originalUrl?: string;
  views?: number;
  [key: string]: any;
}

export interface Cluster {
  id: string;
  articles: Article[];
  cluster_size: number;
  score?: number;
  covered_by: string[];
  highest_authority_article: Article | null;
  first_published_at?: string;
  latest_published_at?: string;
  is_breaking?: boolean;
  breaking_marked_at?: string;
  breaking_source?: 'auto' | 'manual';
}

const URGENT_CATEGORIES = ['Disaster', 'Politics', 'Markets', 'Crime', 'Breaking', 'Urgent'];
const BREAKING_KEYWORDS = ['breaking', 'just in', 'developing', 'dead', 'resigns', 'explosion', 'emergency'];

const SOURCE_AUTHORITY: Record<string, number> = {
  'Reuters': 10,
  'AP': 10,
  'BBC News': 10,
  'BBC News - World': 10,
  'The New York Times': 9,
  'NYT': 9,
  'NPR': 9,
  'CBC': 8,
  'France 24': 8,
  'Al Jazeera': 8,
  'Global Network': 5,
  'Google News Fallback': 3,
};

const CATEGORY_BOOST: Record<string, number> = {
  'Politics': 1.5,
  'World': 1.5,
  'Global': 1.5,
  'Business': 1.3,
  'Technology': 1.2,
  'Science': 1.2,
  'North America': 1.1,
  'Europe': 1.1,
  'Entertainment': 0.8,
  'Sports': 0.8,
  'Lifestyle': 0.7,
};

// Configurable Weights
export const WEIGHTS = {
  w1: 1.0, // avg_source_authority
  w2: 0.8, // cluster_size
  w3: 1.2, // recency_decay
  w4: 0.5, // normalized_engagement (views)
  w5: 1.0, // category_boost
};

const getSourceAuthority = (sourceName: string): number => {
  for (const [key, value] of Object.entries(SOURCE_AUTHORITY)) {
    if (sourceName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return 5; // Default authority
};

const getCategoryBoost = (category: string): number => {
  for (const [key, value] of Object.entries(CATEGORY_BOOST)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return 1.0; // Default boost
};

// Cosine similarity between two TF-IDF vectors
const cosineSimilarity = (vec1: Record<string, number>, vec2: Record<string, number>): number => {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const term in vec1) {
    norm1 += vec1[term] * vec1[term];
    if (vec2[term]) {
      dotProduct += vec1[term] * vec2[term];
    }
  }
  
  for (const term in vec2) {
    norm2 += vec2[term] * vec2[term];
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
};

export const clusterArticles = (articles: Article[], similarityThreshold: number = 0.75, windowHours: number = 6): Cluster[] => {
  const clusters: Cluster[] = [];
  
  // Prepare documents for TF-IDF
  const tfidf = new TfIdf();
  articles.forEach(article => {
    tfidf.addDocument(`${article.title} ${article.summary}`);
  });

  // Extract vectors
  const vectors: Record<string, number>[] = [];
  articles.forEach((_, idx) => {
    const vec: Record<string, number> = {};
    tfidf.listTerms(idx).forEach(item => {
      vec[item.term] = item.tfidf;
    });
    vectors.push(vec);
  });

  const processed = new Set<number>();

  for (let i = 0; i < articles.length; i++) {
    if (processed.has(i)) continue;
    
    const article1 = articles[i];
    const pubDate1 = article1.publishedAt ? new Date(article1.publishedAt) : new Date();
    
    const currentClusterArticles: Article[] = [article1];
    processed.add(i);

    for (let j = i + 1; j < articles.length; j++) {
      if (processed.has(j)) continue;

      const article2 = articles[j];
      const pubDate2 = article2.publishedAt ? new Date(article2.publishedAt) : new Date();

      // Check 6-hour window
      const hoursDiff = Math.abs(pubDate1.getTime() - pubDate2.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= windowHours) {
        const similarity = cosineSimilarity(vectors[i], vectors[j]);
        if (similarity >= similarityThreshold) {
          currentClusterArticles.push(article2);
          processed.add(j);
        }
      }
    }

    const uniqueSources = new Set(currentClusterArticles.map(a => a.source));
    let highestAuth = 0;
    let highestAuthArticle = currentClusterArticles[0];

    currentClusterArticles.forEach(a => {
      const auth = getSourceAuthority(a.source);
      if (auth > highestAuth) {
        highestAuth = auth;
        highestAuthArticle = a;
      }
    });

    clusters.push({
      id: `cluster-${i}-${Date.now()}`,
      articles: currentClusterArticles,
      cluster_size: uniqueSources.size,
      covered_by: Array.from(uniqueSources),
      highest_authority_article: highestAuthArticle
    });
  }

  // Calculate publish windows and auto-detect breaking news
  clusters.forEach(cluster => {
    let minTime = Infinity;
    let maxTime = -Infinity;

    cluster.articles.forEach(a => {
      const t = a.publishedAt ? new Date(a.publishedAt).getTime() : Date.now();
      if (t < minTime) minTime = t;
      if (t > maxTime) maxTime = t;
    });

    cluster.first_published_at = new Date(minTime).toISOString();
    cluster.latest_published_at = new Date(maxTime).toISOString();

    const minsSinceFirst = (Date.now() - minTime) / (1000 * 60);
    
    // has_breaking_keyword
    const hasKeyword = cluster.articles.some(a => {
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return BREAKING_KEYWORDS.some(kw => text.includes(kw));
    });

    const hasUrgentCat = cluster.articles.some(a => URGENT_CATEGORIES.some(uc => a.category.toLowerCase() === uc.toLowerCase()));
    const isFromBreakingFeed = cluster.articles.some(a => a.category === 'Breaking News');

    if ((isFromBreakingFeed && minsSinceFirst <= 120) || (minsSinceFirst <= 45 && cluster.cluster_size >= 3 && (hasKeyword || hasUrgentCat))) {
      cluster.is_breaking = true;
      cluster.breaking_marked_at = new Date().toISOString();
      cluster.breaking_source = 'auto';
    } else {
      cluster.is_breaking = false;
    }
  });

  return clusters;
};

export const scoreCluster = (cluster: Cluster): void => {
  // 1. Avg source authority
  const totalAuth = cluster.articles.reduce((sum, a) => sum + getSourceAuthority(a.source), 0);
  const avgSourceAuthority = totalAuth / cluster.articles.length;

  // 2. Recency decay based on the most recent article in the cluster
  let maxTime = 0;
  cluster.articles.forEach(a => {
    const time = a.publishedAt ? new Date(a.publishedAt).getTime() : Date.now();
    if (time > maxTime) maxTime = time;
  });
  
  const hoursSincePublished = Math.max(0, (Date.now() - maxTime) / (1000 * 60 * 60));
  const recencyDecay = Math.exp(-hoursSincePublished / 24);

  // 3. Normalized engagement
  const totalViews = cluster.articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const normalizedEngagement = Math.min(1.0, totalViews / 50000); // Assume 50k views is max out score of 1.0

  // 4. Category Boost
  // Use category of the highest authority article
  const catBoost = cluster.highest_authority_article ? getCategoryBoost(cluster.highest_authority_article.category) : 1.0;

  // Calculate final score
  cluster.score = 
    (WEIGHTS.w1 * avgSourceAuthority) +
    (WEIGHTS.w2 * cluster.cluster_size) +
    (WEIGHTS.w3 * recencyDecay * 10) + // scale recency to match authority bounds (0-10)
    (WEIGHTS.w4 * normalizedEngagement * 10) +
    (WEIGHTS.w5 * catBoost * 5);

  if (cluster.articles.some(a => a.isPinned)) {
    cluster.score += 10000; // Force pinned articles to the top
  }
};

export const getTopNews = (articles: Article[], limit: number = 10): any[] => {
  const clusters = clusterArticles(articles, 0.75, 6);
  
  clusters.forEach(cluster => {
    scoreCluster(cluster);
  });

  // Sort clusters descending by score
  clusters.sort((a, b) => (b.score || 0) - (a.score || 0));

  const topClusters = clusters.slice(0, limit);

  return topClusters.map(cluster => {
    const repArticle = cluster.highest_authority_article!;
    return {
      ...repArticle,
      is_clustered: true,
      cluster_id: cluster.id,
      covered_by: cluster.covered_by,
      source_count: cluster.cluster_size,
      importance_score: cluster.score
    };
  });
};

export const getBreakingNews = (articles: Article[], overrides: Record<string, { is_breaking: boolean, marked_at: string }> = {}): any[] => {
  const clusters = clusterArticles(articles, 0.75, 6);
  
  const breakingClusters = clusters.filter(cluster => {
    const override = overrides[cluster.id];
    let isBreaking = cluster.is_breaking;
    let markedAt = cluster.breaking_marked_at ? new Date(cluster.breaking_marked_at).getTime() : 0;
    let source = cluster.breaking_source;

    // Apply manual override
    if (override) {
      isBreaking = override.is_breaking;
      markedAt = new Date(override.marked_at).getTime();
      source = 'manual';
    }

    if (!isBreaking) return false;

    // Expiry check (2 hours)
    const hoursSinceMarked = (Date.now() - markedAt) / (1000 * 60 * 60);
    
    // Auto-expire if > 2 hours and not manually pinned (override is false but marked as breaking? Wait, if override is true, it is pinned)
    if (hoursSinceMarked > 2 && source !== 'manual') {
      return false; // Expired
    }

    cluster.is_breaking = true; // Confirm state
    cluster.breaking_marked_at = new Date(markedAt).toISOString();
    cluster.breaking_source = source;
    return true;
  });

  // Sort breaking news by latest update
  breakingClusters.sort((a, b) => {
    const tA = new Date(a.latest_published_at!).getTime();
    const tB = new Date(b.latest_published_at!).getTime();
    return tB - tA;
  });

  return breakingClusters.map(cluster => {
    const repArticle = cluster.highest_authority_article!;
    return {
      ...repArticle,
      is_clustered: true,
      cluster_id: cluster.id,
      covered_by: cluster.covered_by,
      source_count: cluster.cluster_size,
      is_breaking: true,
      breaking_marked_at: cluster.breaking_marked_at,
      breaking_source: cluster.breaking_source
    };
  });
};
