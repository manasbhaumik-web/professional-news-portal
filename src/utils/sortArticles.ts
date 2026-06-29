import { NewsArticle } from '../types';

export const sortArticlesByDate = (articles: NewsArticle[]): NewsArticle[] => {
    if (!articles || !Array.isArray(articles)) return articles;
    return [...articles].sort((a, b) => {
        const tb = new Date(b.publishedAt || b.date).getTime();
        const ta = new Date(a.publishedAt || a.date).getTime();
        return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });
};
