'use client';

import { SignInButton, UserButton } from '@clerk/nextjs';

interface HeaderAuthButtonProps {
  isSignedIn: boolean;
}

export default function HeaderAuthButton({ isSignedIn }: HeaderAuthButtonProps) {
  return (
    <div className="flex items-center gap-3 pt-2">
      {isSignedIn ? (
        <UserButton
          appearance={{ elements: { avatarBox: 'w-8 h-8' } }}
          userProfileMode="navigation"
          userProfileUrl="/profile"
        />
      ) : (
        <SignInButton mode="modal">
          <button className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  );
}
