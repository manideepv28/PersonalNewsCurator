import { useState, useEffect } from 'react';
import { Article } from '@shared/schema';

export interface ArticleFilters {
  category: string;
  search: string;
}

export function useArticles(filters: ArticleFilters) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [filters.category, filters.search]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await fetch(`/api/articles?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { articles, loading, error, refetch: fetchArticles };
}

export function useSavedArticles(userId: number | null) {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchSavedArticles();
    } else {
      setSavedArticles([]);
    }
  }, [userId]);

  const fetchSavedArticles = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/saved-articles/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSavedArticles(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveArticle = async (articleId: number) => {
    if (!userId) return false;
    
    try {
      const response = await fetch('/api/saved-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, articleId }),
      });
      
      if (response.ok) {
        await fetchSavedArticles();
        return true;
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    }
    return false;
  };

  const unsaveArticle = async (articleId: number) => {
    if (!userId) return false;
    
    try {
      const response = await fetch(`/api/saved-articles/${userId}/${articleId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchSavedArticles();
        return true;
      }
    } catch (error) {
      console.error('Failed to unsave article:', error);
    }
    return false;
  };

  const isArticleSaved = (articleId: number) => {
    return savedArticles.some(article => article.id === articleId);
  };

  return {
    savedArticles,
    loading,
    saveArticle,
    unsaveArticle,
    isArticleSaved,
    refetch: fetchSavedArticles,
  };
}
