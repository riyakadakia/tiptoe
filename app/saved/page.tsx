import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import UnsaveButton from './UnsaveButton';

export default async function SavedPage() {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const saves = await db.savedArticle.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link href="/" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
        ← NewsFlash
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">Saved</h1>

      {saves.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No saved articles yet. Click the bookmark icon on any story to save it for later.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-5">
          {saves.map((article) => (
            <li
              key={article.id}
              className="flex items-start justify-between gap-4 rounded border border-border bg-card p-5"
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {article.source}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-base font-semibold leading-snug hover:text-primary"
                >
                  {article.headline}
                </a>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {article.summary}
                </p>
              </div>
              <UnsaveButton url={article.url} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
