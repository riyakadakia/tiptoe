'use client';

import { useState } from 'react';
import { type UserProfile, CATEGORIES, type Category } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

interface ProfileFormProps {
  profile: UserProfile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [aboutMe, setAboutMe] = useState(profile.aboutMe ?? '');
  const [categories, setCategories] = useState<Set<Category>>(new Set(profile.categories as Category[]));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aboutMe, categories: [...categories] }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleCategory(id: Category) {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // keep at least one
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* About me */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-serif text-lg font-semibold">About me</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            This is injected into the chat assistant so it can tailor responses to you.
          </p>
        </div>
        <Textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="CMU engineering student, interested in tech policy and climate. Skip sports and celebrity news."
          className="min-h-28 resize-none"
          maxLength={2000}
        />
      </section>

      {/* Preferred categories */}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-serif text-lg font-semibold">Preferred categories</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your first selection is your default landing tab.
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {CATEGORIES.map(({ id, label }) => (
            <li key={id}>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={categories.has(id)}
                  onChange={() => toggleCategory(id)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>
    </form>
  );
}
