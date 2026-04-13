import { type Article, type Category, CATEGORIES } from '@/lib/types';
import StoryCard, { StoryCardSkeleton } from './StoryCard';

interface StoryGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  category: Category;
  readIds: Set<string>;
  savedUrls: Set<string>;
  isSignedIn: boolean;
  onDiscuss: (article: Article) => void;
  onMarkRead: (article: Article) => void;
  onToggleSave: (article: Article, saved: boolean) => void;
}

const STORY_COUNT = 4;

export default function StoryGrid({
  articles,
  loading,
  error,
  category,
  readIds,
  savedUrls,
  isSignedIn,
  onDiscuss,
  onMarkRead,
  onToggleSave,
}: StoryGridProps) {
  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-muted-foreground">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-5 h-5 w-56 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: STORY_COUNT }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
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

  const readCount = articles.filter((a) => readIds.has(a.id)).length;
  const total = articles.length;
  const allRead = readCount === total;

  return (
    <div className="p-6">
      {/* Header bar */}
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-base font-semibold text-foreground">
          Today&apos;s {total} {total === 1 ? 'story' : 'stories'} in {categoryLabel}
        </h2>
        {allRead ? (
          <div className="text-right">
            <span className="block text-xs font-medium text-primary">You&apos;re done for today</span>
            <span className="block text-xs text-muted-foreground">Check back tomorrow for a fresh set of stories.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    'h-1.5 w-6 rounded-full transition-colors duration-300',
                    i < readCount ? 'bg-primary' : 'bg-muted',
                  ].join(' ')}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {readCount} of {total} read
            </span>
          </div>
        )}
      </div>

      <div className="animate-in fade-in grid grid-cols-1 gap-5 duration-300 sm:grid-cols-2">
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

      {allRead && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Discuss with the assistant to go deeper on the stories you read today.
        </p>
      )}
    </div>
  );
}
