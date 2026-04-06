import { type Article } from '@/lib/types';
import StoryCard, { StoryCardSkeleton } from './StoryCard';

interface StoryGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  readIds: Set<string>;
  savedUrls: Set<string>;
  isSignedIn: boolean;
  onDiscuss: (article: Article) => void;
  onMarkRead: (article: Article) => void;
  onToggleSave: (article: Article, saved: boolean) => void;
}

export default function StoryGrid({
  articles,
  loading,
  error,
  readIds,
  savedUrls,
  isSignedIn,
  onDiscuss,
  onMarkRead,
  onToggleSave,
}: StoryGridProps) {
  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <StoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-muted-foreground">
        No stories available for this category right now.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in grid grid-cols-1 gap-5 p-6 duration-300 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <StoryCard
          key={article.id}
          article={article}
          isRead={readIds.has(article.id)}
          isSaved={savedUrls.has(article.url)}
          isSignedIn={isSignedIn}
          onDiscuss={onDiscuss}
          onMarkRead={onMarkRead}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
