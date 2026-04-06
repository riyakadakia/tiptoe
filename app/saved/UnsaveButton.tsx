'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UnsaveButton({ url }: { url: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleUnsave() {
    setPending(true);
    await fetch(`/api/saves?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      onClick={handleUnsave}
      disabled={pending}
      className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline disabled:opacity-40"
    >
      {pending ? '…' : 'Remove'}
    </button>
  );
}
