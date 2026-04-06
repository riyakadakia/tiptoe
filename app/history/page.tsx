import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect('/');

  const reads = await db.readArticle.findMany({
    where: { userId },
    orderBy: { readAt: 'desc' },
    take: 100,
  });

  // Group by calendar day
  const grouped = new Map<string, typeof reads>();
  for (const read of reads) {
    const day = read.readAt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    if (!grouped.has(day)) grouped.set(day, []);
    grouped.get(day)!.push(read);
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link href="/" className="text-xs text-muted-foreground underline-offset-2 hover:underline">
        ← NewsFlash
      </Link>
      <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight">History</h1>

      {reads.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          No reading history yet. Click any article headline to open it — it will appear here.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {[...grouped.entries()].map(([day, articles]) => (
            <section key={day}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {day}
              </h2>
              <ul className="flex flex-col gap-3">
                {articles.map((article) => (
                  <li key={article.id} className="flex flex-col gap-0.5">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-sm font-semibold leading-snug hover:text-primary"
                    >
                      {article.headline}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {article.source} · {article.category}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
