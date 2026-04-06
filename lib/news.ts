import { type Article, type Category, CATEGORIES } from './types';
import fallbackStories from './fallback-stories';

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.id));

export function isValidCategory(value: string | null): value is Category {
  return value !== null && VALID_CATEGORIES.has(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeArticle(raw: any, category: Category, index: number): Article {
  return {
    id: raw.url ?? `article-${index}`,
    headline: raw.title ?? 'Untitled',
    source: raw.source?.name ?? 'Unknown',
    summary: raw.description ?? raw.content?.slice(0, 300) ?? '',
    url: raw.url ?? '#',
    publishedAt: raw.publishedAt ?? new Date().toISOString(),
    category,
  };
}

export async function fetchNews(category: Category): Promise<Article[]> {
  const key = process.env.NEWS_API_KEY;
  if (!key) return fallbackStories[category];

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=12&apiKey=${key}`,
      { next: { revalidate: 900 } }, // cache for 15 minutes
    );

    if (!res.ok) return fallbackStories[category];

    const data = await res.json();

    if (!Array.isArray(data.articles) || data.articles.length === 0) {
      return fallbackStories[category];
    }

    return data.articles
      .filter((a: any) => a.title && a.title !== '[Removed]') // eslint-disable-line @typescript-eslint/no-explicit-any
      .slice(0, 12)
      .map((a: any, i: number) => normalizeArticle(a, category, i)); // eslint-disable-line @typescript-eslint/no-explicit-any
  } catch {
    return fallbackStories[category];
  }
}
