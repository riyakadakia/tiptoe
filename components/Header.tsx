import { SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { env } from '@/lib/env';

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

        {env.hasClerk && (
          <div className="flex items-center gap-3 pt-2">
            {isSignedIn ? (
              <UserButton
                appearance={{ elements: { avatarBox: 'w-8 h-8' } }}
                userProfileMode="navigation"
                userProfileUrl="/profile"
              >
                <UserButton.MenuItems>
                  <UserButton.Link label="Profile" labelIcon={<ProfileIcon />} href="/profile" />
                  <UserButton.Link label="Saved" labelIcon={<BookmarkIcon />} href="/saved" />
                  <UserButton.Link label="History" labelIcon={<HistoryIcon />} href="/history" />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <SignInButton mode="modal">
                <button className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
