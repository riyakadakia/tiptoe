import { auth } from '@clerk/nextjs/server';
import { env } from '@/lib/env';
import HeaderAuthButton from './HeaderAuthButton';

export default async function Header() {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let isSignedIn = false;
  if (env.hasClerk) {
    const { userId } = await auth();
    isSignedIn = !!userId;
  }

  return (
    <header className="border-b border-border px-6 pb-6 pt-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl font-bold tracking-tight">NewsFlash</h1>
          <p className="mt-2 font-serif text-sm italic text-muted-foreground">
            The day&apos;s news, briefly.
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{date}</p>
        </div>

        {env.hasClerk && <HeaderAuthButton isSignedIn={isSignedIn} />}
      </div>
    </header>
  );
}

