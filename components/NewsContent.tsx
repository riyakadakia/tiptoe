'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { type Article, type Category, type UserProfile } from '@/lib/types';
import { useReadArticles } from '@/hooks/useReadArticles';
import CategoryTabs from './CategoryTabs';
import StoryGrid from './StoryGrid';
import ChatDrawer from './ChatDrawer';

interface NewsContentProps {
  chatAvailable: boolean;
  clerkAvailable: boolean;
}

export default function NewsContent({ chatAvailable, clerkAvailable }: NewsContentProps) {
  const { isSignedIn, userId } = clerkAvailable ? useAuth() : { isSignedIn: false, userId: null }; // eslint-disable-line react-hooks/rules-of-hooks

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  const [category, setCategory] = useState<Category>('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { readIds, markRead } = useReadArticles();
  const [dbReadIds, setDbReadIds] = useState<Set<string>>(new Set());

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [seedArticle, setSeedArticle] = useState<Article | null>(null);

  // Fetch user profile + saved + reads from DB when signed in
  useEffect(() => {
    if (!isSignedIn) {
      setUserProfile(null);
      setSavedUrls(new Set());
      setDbReadIds(new Set());
      return;
    }

    Promise.all([
      fetch('/api/user').then((r) => r.json()) as Promise<UserProfile>,
      fetch('/api/saves').then((r) => r.json()) as Promise<{ url: string }[]>,
      fetch('/api/reads').then((r) => r.json()) as Promise<{ url: string }[]>,
    ]).then(([profile, saves, reads]) => {
      setUserProfile(profile);
      setSavedUrls(new Set(saves.map((s) => s.url)));
      setDbReadIds(new Set(reads.map((r) => r.url)));
    }).catch(() => {});
  }, [isSignedIn]);

  // Set default category from user preferences
  useEffect(() => {
    if (userProfile?.categories?.[0]) {
      setCategory(userProfile.categories[0] as Category);
    }
  }, [userProfile]);

  // Fetch news articles
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setArticles([]);

    fetch(`/api/news?category=${category}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stories');
        return res.json() as Promise<Article[]>;
      })
      .then((data) => {
        if (!cancelled) { setArticles(data); setLoading(false); }
      })
      .catch((err: Error) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [category]);

  function handleMarkRead(article: Article) {
    markRead(article.id); // sessionStorage fallback
    if (isSignedIn) {
      fetch('/api/reads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: article.url,
          headline: article.headline,
          source: article.source,
          category: article.category,
        }),
      }).catch(() => {});
      setDbReadIds((prev) => new Set(prev).add(article.url));
    }
  }

  function handleToggleSave(article: Article, saved: boolean) {
    setSavedUrls((prev) => {
      const next = new Set(prev);
      if (saved) next.add(article.url); else next.delete(article.url);
      return next;
    });
  }

  function handleDiscuss(article: Article) {
    setSeedArticle(article);
    setDrawerOpen(true);
  }

  // Merged read state: DB urls union sessionStorage ids
  const mergedReadIds = new Set([
    ...readIds,
    ...Array.from(dbReadIds).map((url) => {
      const match = articles.find((a) => a.url === url);
      return match?.id ?? '';
    }),
  ]);

  return (
    <>
      <CategoryTabs
        selected={category}
        onSelect={setCategory}
        preferredCategories={userProfile?.categories as Category[] | undefined}
      />

      <StoryGrid
        key={category}
        articles={articles}
        loading={loading}
        error={error}
        category={category}
        readIds={mergedReadIds}
        savedUrls={savedUrls}
        isSignedIn={!!isSignedIn}
        onDiscuss={handleDiscuss}
        onMarkRead={handleMarkRead}
        onToggleSave={handleToggleSave}
      />

      <button
        onClick={() => { setSeedArticle(null); setDrawerOpen(true); }}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:opacity-90"
      >
        <ChatIcon />
      </button>

      <ChatDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        seedArticle={seedArticle}
        articles={articles}
        chatAvailable={chatAvailable}
      />
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
