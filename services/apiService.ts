import { Article, Author } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

/**
 * Fetch all articles with optional filters
 */
export const fetchArticles = async (params?: {
  category?: string;
  search?: string;
}): Promise<Article[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${API_BASE_URL}/articles.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Fetch single article by ID
 */
export const fetchArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles.php?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

/**
 * Create new article
 */
export const createArticle = async (article: Omit<Article, 'id'>): Promise<Article> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * Update existing article
 */
export const updateArticle = async (article: Article): Promise<Article> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * Delete article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

/**
 * Fetch all authors
 */
export const fetchAuthors = async (): Promise<Author[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/authors.php`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
};
