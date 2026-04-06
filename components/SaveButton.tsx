'use client';

import { useState } from 'react';
import { type Article } from '@/lib/types';

interface SaveButtonProps {
  article: Article;
  isSaved: boolean;
  isSignedIn: boolean;
  onToggle: (article: Article, saved: boolean) => void;
}

export default function SaveButton({ article, isSaved, isSignedIn, onToggle }: SaveButtonProps) {
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isSignedIn || pending) return;

    setPending(true);
    try {
      if (isSaved) {
        await fetch(`/api/saves?url=${encodeURIComponent(article.url)}`, { method: 'DELETE' });
      } else {
        await fetch('/api/saves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: article.url,
            headline: article.headline,
            source: article.source,
            summary: article.summary,
            category: article.category,
          }),
        });
      }
      onToggle(article, !isSaved);
    } finally {
      setPending(false);
    }
  }

  if (!isSignedIn) return null;

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={isSaved ? 'Unsave article' : 'Save article'}
      className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isSaved ? 'text-primary' : ''}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
