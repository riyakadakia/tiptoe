import { type Article } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import SaveButton from './SaveButton';

interface StoryCardProps {
  article: Article;
  isRead: boolean;
  isSaved: boolean;
  isSignedIn: boolean;
  onDiscuss: (article: Article) => void;
  onMarkRead: (article: Article) => void;
  onToggleSave: (article: Article, saved: boolean) => void;
}

export default function StoryCard({
  article,
  isRead,
  isSaved,
  isSignedIn,
  onDiscuss,
  onMarkRead,
  onToggleSave,
}: StoryCardProps) {
  function handleHeadlineClick() {
    onMarkRead(article);
  }

  return (
    <article
      className={[
        'group flex flex-col gap-3 rounded border bg-card p-5 transition-colors',
        isRead ? 'border-border/50 opacity-60' : 'border-border hover:border-neutral-300',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {article.source}
        </span>
        <div className="flex items-center gap-2">
          {isRead && <span className="text-xs italic text-muted-foreground/60">read</span>}
          <SaveButton
            article={article}
            isSaved={isSaved}
            isSignedIn={isSignedIn}
            onToggle={onToggleSave}
          />
        </div>
      </div>

      <h2 className="font-serif text-[1.05rem] font-semibold leading-snug tracking-tight">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleHeadlineClick}
          className="line-clamp-2 hover:text-primary"
        >
          {article.headline}
        </a>
      </h2>

      <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">{article.summary}</p>

      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">{formatRelativeTime(article.publishedAt)}</span>
        <button
          onClick={() => onDiscuss(article)}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Discuss
        </button>
      </div>
    </article>
  );
}

export function StoryCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded border border-border bg-card p-5">
      <Skeleton className="h-3 w-20" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
