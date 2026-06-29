import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserPreferences, NewsArticle } from '../types';
import { sortArticlesByDate } from '../utils/sortArticles';
import { mixArticlesByCategories } from '../utils/mixCategories';

interface NewsContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  bookmarks: string[];
  toggleBookmark: (id: string, e?: React.MouseEvent) => void;
  failedImages: string[];
  setFailedImages: React.Dispatch<React.SetStateAction<string[]>>;
  isAdMinimized: boolean;
  setIsAdMinimized: (minimized: boolean) => void;
  
  trendingArticles: NewsArticle[];
  isLoadingArticles: boolean;
  errorFeedback: string | null;
  setErrorFeedback: (error: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMenuCategory: string;
  setSelectedMenuCategory: (category: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    selectedCategories: ['Global', 'Local', 'Politics'],
    selectedKeywords: ['Photonic', 'Fusion', 'Carbon'],
    readingSpeed: 'normal'
  });

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [isAdMinimized, setIsAdMinimized] = useState(false);
  
  const [trendingArticles, setTrendingArticles] = useState<NewsArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>("United States");

  const toggleBookmark = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }, []);

  const fetchTrendingNews = useCallback(async () => {
    setIsLoadingArticles(true);
    setErrorFeedback(null);
    try {
        const res = await fetch('/api/news/trending');
        if (!res.ok) throw new Error("Failed to load trending stories");
        const data = await res.json();
        setTrendingArticles(mixArticlesByCategories(data));
    } catch (e: any) {
        setErrorFeedback(e.message || "Failed to establish secure index connection.");
    } finally {
        setIsLoadingArticles(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingNews();
  }, [fetchTrendingNews]);

  return (
    <NewsContext.Provider
      value={{
        preferences,
        setPreferences,
        bookmarks,
        toggleBookmark,
        failedImages,
        setFailedImages,
        isAdMinimized,
        setIsAdMinimized,
        trendingArticles,
        isLoadingArticles,
        errorFeedback,
        setErrorFeedback,
        searchQuery,
        setSearchQuery,
        selectedMenuCategory,
        setSelectedMenuCategory,
        selectedCountry,
        setSelectedCountry
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}

