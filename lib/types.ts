export type Category = 'general' | 'technology' | 'business' | 'science' | 'health';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
];

export interface Article {
  id: string;
  headline: string;
  source: string;
  summary: string;
  url: string;
  publishedAt: string;
  category: Category;
}

export interface UserProfile {
  id: string;
  email: string;
  aboutMe: string | null;
  categories: Category[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
