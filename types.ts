export type Category = 'News' | 'Deep Dive' | 'Tutorial' | 'Opinion' | 'Research';

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string; // Short description for cards
  content: string; // Full content (HTML/Markdown supported via logic)
  category: Category;
  author: Author;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
  isTopStory?: boolean;
  readTimeMinutes: number;
  aiSummary?: string; // Generated AI Summary
}
