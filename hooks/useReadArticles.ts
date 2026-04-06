'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'newsflash:read';

export function useReadArticles() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReadIds(new Set(JSON.parse(stored) as string[]));
      } catch {
        // ignore malformed storage
      }
    }
  }, []);

  function markRead(id: string) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  return { readIds, markRead };
}
