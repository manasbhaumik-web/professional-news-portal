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
  originalUrl?: string;
  sportName?: string;
  publishedAt?: string;
  timeAgo?: string;
}

export interface UserPreferences {
  selectedCategories: string[];
  selectedKeywords: string[];
  readingSpeed: 'normal' | 'fast' | 'digest';
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
