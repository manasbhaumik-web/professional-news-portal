import { NewsArticle } from '../types';

export const mixArticlesByCategories = (articles: NewsArticle[]): NewsArticle[] => {
    if (!articles || !Array.isArray(articles)) return articles;
    
    const categoriesMap = new Map<string, NewsArticle[]>();
    
    // Group articles by category
    articles.forEach(article => {
        const cat = article.category || 'Unknown';
        if (!categoriesMap.has(cat)) {
            categoriesMap.set(cat, []);
        }
        categoriesMap.get(cat)!.push(article);
    });
    
    const result: NewsArticle[] = [];
    const categoryKeys = Array.from(categoriesMap.keys());
    
    let added = true;
    let index = 0;
    
    // Round-robin selection
    while (added) {
        added = false;
        for (const cat of categoryKeys) {
            const list = categoriesMap.get(cat)!;
            if (index < list.length) {
                result.push(list[index]);
                added = true;
            }
        }
        index++;
    }
    
    return result;
};
