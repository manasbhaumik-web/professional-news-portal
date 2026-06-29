export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
  date: string;
  readTime: string;
  imageUrl: string;
  trendsUp?: boolean;
  views: number;
  isAiGenerated?: boolean;
  url?: string;
  isPinned?: boolean;
  isDraft?: boolean;
  originalUrl?: string;
  sportName?: string;
  publishedAt?: string;
  timeAgo?: string;
  is_clustered?: boolean;
  cluster_id?: string;
  covered_by?: string[];
  source_count?: number;
  importance_score?: number;
  is_breaking?: boolean;
  breaking_source?: string;
}

export interface UserPreferences {
  selectedCategories: string[];
  selectedKeywords: string[];
  readingSpeed: 'normal' | 'fast' | 'digest';
}

export interface UserBehaviorProfile {
  categories: Record<string, number>;
  keywords: Record<string, number>;
  lastUpdated: string;
}

export interface PushNotification {
  id: string;
  timestamp: string;
  type: 'breaking' | 'personalized' | 'market';
  title: string;
  message: string;
  sourceArticleId?: string;
  read: boolean;
}
